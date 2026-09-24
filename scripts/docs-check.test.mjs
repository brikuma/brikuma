import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { anchors, checkDocumentation } from './docs-check.mjs';

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'brikuma-docs-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  function write(name, content) {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), content);
  }
  write(
    'docs/link-policy.json',
    JSON.stringify({
      version: 1,
      conditionalLinks: [],
      approvedSubmodules: [],
    }),
  );
  write('docs/README.md', '# Index\n\n[Policy](POLICY.md#rule)\n');
  write('docs/POLICY.md', '# Policy\n\n## Rule\n');
  return { root, write };
}

function git(root, ...args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function commit(root) {
  git(root, 'add', '--all');
  return git(
    root,
    '-c',
    'user.name=Disposable Documentation Test',
    '-c',
    'user.email=docs-test@example.invalid',
    'commit',
    '-m',
    'docs(spec): add disposable fixture',
  );
}

test('valid file, code link, anchor and instruction import pass', (t) => {
  const { root, write } = fixture(t);
  write('CLAUDE.md', '@AGENTS.md\n');
  write('AGENTS.md', '# Instructions\n\n[Source](scripts/example.mjs)\n');
  write('scripts/example.mjs', 'export const example = true;\n');
  assert.deepEqual(checkDocumentation({ root }).errors, []);
});

test('duplicate heading anchors use GitHub-style suffixes', () => {
  assert.deepEqual(
    [...anchors('# Repeat\n## Repeat\n')],
    ['repeat', 'repeat-1'],
  );
});

test('dangling file, nonexistent API source and stale anchor fail', (t) => {
  const { root, write } = fixture(t);
  write(
    'docs/POLICY.md',
    '# Policy\n\n[Missing](MISSING.md)\n[API](../src/invented-api.ts)\n',
  );
  const errors = checkDocumentation({ root }).errors.join('\n');
  assert.match(errors, /missing target docs\/MISSING.md/);
  assert.match(errors, /missing target src\/invented-api.ts/);
  assert.match(errors, /missing anchor docs\/POLICY.md#rule/);
});

test('orphan wiki page and cyclic instruction imports fail', (t) => {
  const { root, write } = fixture(t);
  write('docs/ORPHAN.md', '# Orphan\n');
  write('CLAUDE.md', '@AGENTS.md\n');
  write('AGENTS.md', '@CLAUDE.md\n');
  const errors = checkDocumentation({ root }).errors.join('\n');
  assert.match(errors, /Unreachable wiki page/);
  assert.match(errors, /Instruction import cycle/);
});

test('cross-repository target requires an exact deliberate manifest entry', (t) => {
  const { root, write } = fixture(t);
  write(
    'docs/POLICY.md',
    '# Policy\n\n## Rule\n\n[Frontend](../brikuma-frontend/README.md)\n',
  );
  write('brikuma-frontend/README.md', '# Child\n');
  assert.match(
    checkDocumentation({ root }).errors.join('\n'),
    /missing exact policy entry/,
  );
  write(
    'docs/link-policy.json',
    JSON.stringify({
      version: 1,
      conditionalLinks: [
        {
          source: 'docs/POLICY.md',
          target: 'brikuma-frontend/README.md',
          reason: 'Explicit child documentation fixture',
        },
      ],
    }),
  );
  assert.deepEqual(checkDocumentation({ root }).errors, []);
});

test('pinned integration rejects missing registration', (t) => {
  const { root } = fixture(t);
  git(root, 'init', '-q');
  commit(root);
  assert.throws(
    () => checkDocumentation({ root, mode: 'pinned', tree: 'HEAD' }),
    /\.gitmodules absent/,
  );
});

test('bootstrap candidate checks exact root tree and reports only declared child links unavailable', (t) => {
  const { root, write } = fixture(t);
  write(
    'docs/POLICY.md',
    '# Policy\n\n## Rule\n\n[Frontend](../brikuma-frontend/README.md)\n',
  );
  write(
    'docs/link-policy.json',
    JSON.stringify({
      version: 1,
      conditionalLinks: [
        {
          source: 'docs/POLICY.md',
          target: 'brikuma-frontend/README.md',
          reason: 'Explicit conditional child fixture',
        },
      ],
    }),
  );
  git(root, 'init', '-q');
  commit(root);
  write('docs/POLICY.md', '# Unstaged change\n');
  const result = checkDocumentation({ root, mode: 'candidate', tree: 'HEAD' });
  assert.deepEqual(result.errors, []);
  assert.equal(result.unavailable.length, 1);
  assert.match(result.label, /Root candidate/);
});

function integration(t, invalid) {
  const f = fixture(t);
  git(f.root, 'init', '-q');
  const children = [
    'brikuma-frontend',
    'brikuma-backend',
    'brikuma-infrastructure',
  ];
  const approvedSubmodules = children.map((child) => ({
    path: child,
    url: `https://example.invalid/disposable/${child}.git`,
  }));
  f.write(
    'docs/link-policy.json',
    JSON.stringify({ version: 1, conditionalLinks: [], approvedSubmodules }),
  );
  f.write(
    '.gitmodules',
    approvedSubmodules
      .map(
        ({ path: child, url }) =>
          `[submodule "${child}"]\n\tpath = ${child}\n\turl = ${url}\n`,
      )
      .join(''),
  );
  git(f.root, 'add', 'docs', '.gitmodules');
  for (const child of children) {
    f.write(`${child}/README.md`, '# Pinned child\n');
    git(path.join(f.root, child), 'init', '-q');
    commit(path.join(f.root, child));
    const sha = git(path.join(f.root, child), 'rev-parse', 'HEAD');
    if (invalid === 'ordinary' && child === children[0]) {
      f.write('ordinary.txt', 'wrong object');
      const blob = git(f.root, 'hash-object', '-w', 'ordinary.txt');
      git(
        f.root,
        'update-index',
        '--add',
        '--cacheinfo',
        `100644,${blob},${child}`,
      );
    } else {
      git(
        f.root,
        'update-index',
        '--add',
        '--cacheinfo',
        `160000,${invalid === 'unavailable' && child === children[0] ? '1234567890123456789012345678901234567890' : sha},${child}`,
      );
    }
  }
  const tree = git(f.root, 'write-tree');
  return { ...f, tree };
}

test('pinned integration rejects ordinary files masquerading as child pins', (t) => {
  const { root, tree } = integration(t, 'ordinary');
  assert.throws(
    () => checkDocumentation({ root, mode: 'pinned', tree }),
    /not a proper mode 160000 gitlink/,
  );
});

test('pinned integration rejects unavailable local child commit objects', (t) => {
  const { root, tree } = integration(t, 'unavailable');
  assert.throws(
    () => checkDocumentation({ root, mode: 'pinned', tree }),
    /pinned commit .* unavailable/,
  );
});

test('valid pinned trees pass and ignore a later working-tree fix or defect', (t) => {
  const { root, tree, write } = integration(t);
  write('docs/POLICY.md', '# Changed\n\n[Broken](missing.md)\n');
  assert.deepEqual(
    checkDocumentation({ root, mode: 'pinned', tree }).errors,
    [],
  );
  assert.ok(checkDocumentation({ root }).errors.length > 0);
});
