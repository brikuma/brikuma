import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const CHILDREN = [
  'brikuma-frontend',
  'brikuma-backend',
  'brikuma-infrastructure',
];
const EXCLUDED = new Set([
  '.git',
  'node_modules',
  '.next',
  'out',
  'artifacts',
  '.agents',
  '.codex',
]);

function git(cwd, args) {
  const result = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0)
    throw new Error(result.stderr.trim() || `git ${args[0]} failed`);
  return result.stdout;
}

function walk(root, prefix = '') {
  const result = [];
  for (const entry of readdirSync(path.join(root, prefix), {
    withFileTypes: true,
  })) {
    if (EXCLUDED.has(entry.name) || entry.isSymbolicLink()) continue;
    const name = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...walk(root, name));
    else if (entry.isFile()) result.push(name);
  }
  return result;
}

function owner(name) {
  return (
    CHILDREN.find((child) => name === child || name.startsWith(`${child}/`)) ||
    'root'
  );
}

function treeEntries(root, tree) {
  return git(root, ['ls-tree', '-rz', tree])
    .split('\0')
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf('\t');
      const [mode, type, object] = line.slice(0, tab).split(' ');
      return { mode, type, object, name: line.slice(tab + 1) };
    });
}

function readPolicy(read) {
  try {
    const policy = JSON.parse(read('docs/link-policy.json'));
    if (policy.version !== 1 || !Array.isArray(policy.conditionalLinks))
      throw new Error('invalid schema');
    for (const item of policy.conditionalLinks) {
      if (!item.source || !item.target || !item.reason)
        throw new Error('missing link field');
    }
    return policy;
  } catch (error) {
    throw new Error(`Cannot read documentation link policy: ${error.message}`);
  }
}

function worktreeView(root) {
  const files = new Set(walk(root));
  return {
    files,
    read(name) {
      return readFileSync(path.join(root, name), 'utf8');
    },
    exists(name) {
      return (
        files.has(name) ||
        [...files].some((file) => file.startsWith(`${name}/`))
      );
    },
    label: 'Working-tree documentation only; NOT a pinned integration check.',
  };
}

function candidateView(root, tree) {
  if (!tree)
    throw new Error(
      'Candidate documentation requires --tree=<candidate-root-tree-or-commit>.',
    );
  const locations = new Map(
    treeEntries(root, tree)
      .filter((entry) => entry.type === 'blob')
      .map((entry) => [entry.name, entry.object]),
  );
  return {
    files: new Set(locations.keys()),
    read(name) {
      const object = locations.get(name);
      if (!object) throw new Error(`Missing candidate file: ${name}`);
      return git(root, ['cat-file', 'blob', object]);
    },
    exists(name) {
      return (
        locations.has(name) ||
        [...locations.keys()].some((file) => file.startsWith(`${name}/`))
      );
    },
    label: `Root candidate documentation: ${tree}. Explicit child links are unavailable until pinned integration.`,
  };
}

function pinnedView(root, tree) {
  if (!tree)
    throw new Error(
      'Pinned integration requires --tree=<candidate-root-tree-or-commit>.',
    );
  const entries = treeEntries(root, tree);
  const locations = new Map(
    entries
      .filter((entry) => entry.type === 'blob')
      .map((entry) => [entry.name, { repo: root, object: entry.object }]),
  );
  const policy = readPolicy((name) => {
    const location = locations.get(name);
    if (!location) throw new Error(`Missing pinned file: ${name}`);
    return git(location.repo, ['cat-file', 'blob', location.object]);
  });
  if (!locations.has('.gitmodules'))
    throw new Error(
      'BLOCKED: .gitmodules absent; approved remote URLs and registration required.',
    );
  const config = git(root, [
    'config',
    '--blob',
    `${tree}:.gitmodules`,
    '--get-regexp',
    '^submodule\\..*\\.(path|url)$',
  ]);
  const registrations = new Map();
  for (const line of config.trim().split('\n')) {
    const match = line.match(/^submodule\.(.+)\.(path|url) (.+)$/);
    if (!match) throw new Error(`Invalid .gitmodules configuration: ${line}`);
    const record = registrations.get(match[1]) || {};
    record[match[2]] = match[3];
    registrations.set(match[1], record);
  }
  for (const child of CHILDREN) {
    const registration = [...registrations.values()].find(
      (record) => record.path === child,
    );
    if (
      !registration ||
      !registration.url ||
      !/^(https:\/\/|ssh:\/\/|[^/\s]+@[^:\s]+:)/.test(registration.url)
    ) {
      throw new Error(
        `BLOCKED: ${child} needs a registered approved non-local remote URL.`,
      );
    }
    if (
      !(policy.approvedSubmodules || []).some(
        (approved) =>
          approved.path === child && approved.url === registration.url,
      )
    ) {
      throw new Error(
        `BLOCKED: ${child} remote is not listed in the owner-approved link policy.`,
      );
    }
    const entry = entries.find((item) => item.name === child);
    if (!entry || entry.mode !== '160000' || entry.type !== 'commit')
      throw new Error(`${child} is not a proper mode 160000 gitlink.`);
    if (entries.some((item) => item.name.startsWith(`${child}/`)))
      throw new Error(`${child} source is double-tracked in the root.`);
    const childRoot = path.join(root, child);
    if (!existsSync(childRoot))
      throw new Error(`BLOCKED: local child repository unavailable: ${child}`);
    if (
      realpathSync(git(childRoot, ['rev-parse', '--show-toplevel']).trim()) !==
      realpathSync(childRoot)
    ) {
      throw new Error(`${child} is not an independent repository.`);
    }
    try {
      git(childRoot, ['cat-file', '-e', `${entry.object}^{commit}`]);
    } catch {
      throw new Error(
        `BLOCKED: pinned commit ${entry.object} unavailable in ${child}.`,
      );
    }
    for (const childEntry of treeEntries(childRoot, entry.object)) {
      if (childEntry.type === 'blob')
        locations.set(`${child}/${childEntry.name}`, {
          repo: childRoot,
          object: childEntry.object,
        });
    }
  }
  return {
    files: new Set(locations.keys()),
    read(name) {
      const location = locations.get(name);
      if (!location) throw new Error(`Missing pinned file: ${name}`);
      return git(location.repo, ['cat-file', 'blob', location.object]);
    },
    exists(name) {
      return (
        locations.has(name) ||
        [...locations.keys()].some((file) => file.startsWith(`${name}/`))
      );
    },
    label: `Pinned integration documentation: ${tree}. Child working-tree changes are ignored.`,
  };
}

function prose(content) {
  return content.replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, '');
}

export function anchors(content) {
  const counts = new Map();
  const result = new Set();
  for (const line of prose(content).split('\n')) {
    const match = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*$/);
    if (!match) continue;
    const base = match[1]
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\p{L}\p{N}_\-\s]/gu, '')
      .replace(/\s/g, '-');
    const count = counts.get(base) || 0;
    counts.set(base, count + 1);
    result.add(count ? `${base}-${count}` : base);
  }
  for (const match of content.matchAll(/\bid=["']([^"']+)["']/g))
    result.add(match[1]);
  return result;
}

export function references(content, name) {
  const text = prose(content);
  const result = [
    ...text.matchAll(/\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g),
  ].map((match) => match[1] || match[2]);
  for (const match of text.matchAll(/^@([^\s]+)\s*$/gm)) result.push(match[1]);
  return result;
}

export function checkDocumentation({
  root,
  mode = 'worktree',
  tree,
  scope = 'root',
}) {
  if (!['worktree', 'candidate', 'pinned'].includes(mode))
    throw new Error(`Unknown documentation mode: ${mode}`);
  if (!['root', 'all'].includes(scope))
    throw new Error(`Unknown documentation scope: ${scope}`);
  const view =
    mode === 'pinned'
      ? pinnedView(root, tree)
      : mode === 'candidate'
        ? candidateView(root, tree)
        : worktreeView(root);
  const policy = readPolicy(view.read);
  const errors = [];
  const unavailable = [];
  const files = [...view.files].filter(
    (name) =>
      name.endsWith('.md') && (scope === 'all' || owner(name) === 'root'),
  );
  const allowed = new Set(
    policy.conditionalLinks.map((item) => `${item.source}\0${item.target}`),
  );
  const graph = new Map();
  const imports = new Map();
  for (const name of files) {
    imports.set(
      name,
      [...prose(view.read(name)).matchAll(/^@([^\s]+)\s*$/gm)].map((match) =>
        path.posix.normalize(
          path.posix.join(path.posix.dirname(name), match[1]),
        ),
      ),
    );
    const links = [];
    for (const reference of references(view.read(name), name)) {
      if (/^(?:https?:|mailto:|data:|blob:|tel:)/i.test(reference)) continue;
      if (/^[a-z][a-z\d+.-]*:/i.test(reference) || reference.startsWith('/')) {
        errors.push(`${name}: unsupported non-relative link ${reference}`);
        continue;
      }
      const [rawPath, rawAnchor] = reference.split('#', 2);
      let target;
      try {
        target = rawPath
          ? path.posix.normalize(
              path.posix.join(
                path.posix.dirname(name),
                decodeURIComponent(rawPath),
              ),
            )
          : name;
      } catch {
        errors.push(`${name}: invalid encoded link ${reference}`);
        continue;
      }
      if (target.startsWith('../')) {
        errors.push(`${name}: link escapes integration root: ${reference}`);
        continue;
      }
      if (owner(target) !== owner(name) && !allowed.has(`${name}\0${target}`)) {
        errors.push(
          `${name}: cross-repository link missing exact policy entry: ${target}`,
        );
      }
      if (!view.exists(target)) {
        if (
          mode === 'candidate' &&
          owner(target) !== 'root' &&
          allowed.has(`${name}\0${target}`)
        )
          unavailable.push(
            `${name}: conditional child target unavailable in root-only tree: ${target}`,
          );
        else errors.push(`${name}: missing target ${target}`);
        continue;
      }
      if (rawAnchor && target.endsWith('.md')) {
        let fragment;
        try {
          fragment = decodeURIComponent(rawAnchor);
        } catch {
          errors.push(`${name}: invalid fragment ${rawAnchor}`);
          continue;
        }
        if (!anchors(view.read(target)).has(fragment))
          errors.push(`${name}: missing anchor ${target}#${fragment}`);
      }
      links.push(target);
    }
    graph.set(name, links);
  }
  function visitImport(name, stack = []) {
    if (stack.includes(name)) {
      errors.push(`Instruction import cycle: ${[...stack, name].join(' -> ')}`);
      return;
    }
    for (const target of imports.get(name) || [])
      visitImport(target, [...stack, name]);
  }
  for (const name of imports.keys()) visitImport(name);
  for (const repository of scope === 'all' ? ['root', ...CHILDREN] : ['root']) {
    const prefix = repository === 'root' ? '' : `${repository}/`;
    const entry = `${prefix}docs/README.md`;
    if (!view.files.has(entry)) {
      errors.push(`Missing owning documentation index: ${entry}`);
      continue;
    }
    const visited = new Set();
    const pending = [entry];
    while (pending.length) {
      const current = pending.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      for (const target of graph.get(current) || [])
        if (owner(target) === repository) pending.push(target);
    }
    for (const file of files) {
      if (
        owner(file) === repository &&
        file.startsWith(`${prefix}docs/`) &&
        !visited.has(file)
      )
        errors.push(`Unreachable wiki page: ${file}`);
    }
  }
  return { label: view.label, checked: files.length, errors, unavailable };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const argumentsMap = Object.fromEntries(
    process.argv.slice(2).map((arg) => arg.replace(/^--/, '').split('=')),
  );
  try {
    const result = checkDocumentation({
      root: path.resolve(argumentsMap.root || '.'),
      mode: argumentsMap.mode || 'worktree',
      tree: argumentsMap.tree,
      scope: argumentsMap.scope || 'root',
    });
    console.log(result.label);
    console.log(
      `Checked ${result.checked} Markdown files; ${result.errors.length} error(s).`,
    );
    for (const error of result.errors) console.error(error);
    for (const item of result.unavailable) console.log(`UNAVAILABLE: ${item}`);
    process.exitCode = result.errors.length ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
