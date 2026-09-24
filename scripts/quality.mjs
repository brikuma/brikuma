import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkDocumentation } from './docs-check.mjs';

function run(root, command, args, allowFailure = false) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
  if (!allowFailure && result.status !== 0)
    throw new Error(
      result.stderr.trim() || result.stdout.trim() || `${command} failed`,
    );
  return {
    command: [command, ...args],
    exitCode: result.status ?? 1,
    output: `${result.stdout || ''}${result.stderr || ''}`,
  };
}

function git(root, ...args) {
  return run(root, 'git', args).output.trim();
}

export function relevant(name) {
  if (
    /^(brikuma-frontend|brikuma-backend|brikuma-infrastructure)(\/|$)/.test(
      name,
    )
  )
    return false;
  return (
    /(^|\/)(AGENTS|CLAUDE)\.md$/.test(name) ||
    /\.(md|mjs|cjs|json|yaml|yml)$/.test(name) ||
    /^(scripts\/|\.husky\/|\.github\/|\.gitmodules$|\.gitignore$|\.node-version$|\.npmrc$|\.editorconfig$|\.prettierignore$)/.test(
      name,
    )
  );
}

export function assertStagedInputs(root) {
  const unstaged = run(root, 'git', ['diff', '--name-only', '-z'])
    .output.split('\0')
    .filter(Boolean)
    .filter(relevant);
  const untracked = run(root, 'git', [
    'ls-files',
    '--others',
    '--exclude-standard',
    '-z',
  ])
    .output.split('\0')
    .filter(Boolean)
    .filter(relevant);
  if (unstaged.length || untracked.length)
    throw new Error(
      `Candidate verification refused without changing your files. Relevant working-tree inputs differ from the index:\n${[...unstaged, ...untracked].join('\n')}\nStage the intended changes or verify a separate clean candidate; unrelated files are preserved.`,
    );
}

function hashFile(root, file) {
  return existsSync(path.join(root, file))
    ? createHash('sha256')
        .update(readFileSync(path.join(root, file)))
        .digest('hex')
    : null;
}

function requiresPinnedReview(root) {
  return run(root, 'git', ['diff', '--cached', '--name-only', '-z'])
    .output.split('\0')
    .some((name) =>
      /^(\.gitmodules|brikuma-frontend|brikuma-backend|brikuma-infrastructure)$/.test(
        name,
      ),
    );
}

export function snapshot(root) {
  assertStagedInputs(root);
  const base = run(root, 'git', ['rev-parse', '--verify', 'HEAD'], true);
  return {
    repository: realpathSync(git(root, 'rev-parse', '--show-toplevel')),
    baseCommit: base.exitCode === 0 ? base.output.trim() : 'initial-state',
    candidateTree: git(root, 'write-tree'),
    lockfileHash: hashFile(root, 'package-lock.json'),
    nodeVersion: process.version,
    npmVersion: run(root, 'npm', ['--version']).output.trim(),
    inputs: Object.fromEntries(
      ['package.json', 'package-lock.json', '.node-version', '.npmrc'].map(
        (file) => [file, hashFile(root, file)],
      ),
    ),
    environment: {
      node: process.version,
      platform: process.platform,
      architecture: process.arch,
    },
  };
}

export function sameCandidate(expected, current) {
  for (const key of [
    'repository',
    'baseCommit',
    'candidateTree',
    'lockfileHash',
    'nodeVersion',
    'npmVersion',
  ])
    if (expected[key] !== current[key]) return false;
  return (
    JSON.stringify(expected.inputs) === JSON.stringify(current.inputs) &&
    JSON.stringify(expected.environment) === JSON.stringify(current.environment)
  );
}

export function assertCommittedInputs(root) {
  const committed = snapshot(root);
  if (
    committed.baseCommit === 'initial-state' ||
    committed.candidateTree !== git(root, 'rev-parse', 'HEAD^{tree}')
  ) {
    throw new Error(
      'Push verification requires root tooling/documentation inputs to match the committed HEAD tree. Preserve work and use a clean checkout for a different published revision.',
    );
  }
  return committed;
}

function evidenceDirectory(root) {
  const directory = path.join(root, 'artifacts', 'quality');
  const ignored = run(
    root,
    'git',
    ['check-ignore', '--quiet', 'artifacts/quality/review.json'],
    true,
  );
  if (ignored.exitCode !== 0)
    throw new Error(
      'Evidence must live under the Git-ignored artifacts directory.',
    );
  mkdirSync(directory, { recursive: true });
  return directory;
}

export function prepareEvidence(root) {
  const candidate = snapshot(root);
  const directory = evidenceDirectory(root);
  const commands = [
    ['npm', ['run', 'staged:check']],
    [
      'node',
      [
        'scripts/docs-check.mjs',
        '--mode=candidate',
        `--tree=${candidate.candidateTree}`,
      ],
    ],
    [
      'node',
      ['--test', 'scripts/docs-check.test.mjs', 'scripts/quality.test.mjs'],
    ],
  ];
  if (requiresPinnedReview(root))
    commands.push([
      'node',
      [
        'scripts/docs-check.mjs',
        '--mode=pinned',
        `--tree=${candidate.candidateTree}`,
        '--scope=all',
      ],
    ]);
  const reports = [];
  for (const [command, args] of commands) {
    const result = run(root, command, args, true);
    const log = `check-${reports.length + 1}.log`;
    writeFileSync(path.join(directory, log), result.output);
    reports.push({
      command: result.command.join(' '),
      exitCode: result.exitCode,
      log: `artifacts/quality/${log}`,
      logHash: createHash('sha256').update(result.output).digest('hex'),
      recordedAt: new Date().toISOString(),
    });
    process.stdout.write(result.output);
    if (result.exitCode !== 0) {
      writeFileSync(
        path.join(directory, 'checks.json'),
        JSON.stringify(
          {
            schemaVersion: 1,
            ...candidate,
            commands: reports,
            complete: false,
          },
          null,
          2,
        ),
      );
      throw new Error(`Candidate check failed: ${result.command.join(' ')}`);
    }
  }
  if (!sameCandidate(candidate, snapshot(root)))
    throw new Error(
      'Candidate changed during verification; evidence is invalid.',
    );
  const record = {
    schemaVersion: 1,
    ...candidate,
    commands: reports,
    complete: true,
    recordedAt: new Date().toISOString(),
  };
  writeFileSync(
    path.join(directory, 'checks.json'),
    `${JSON.stringify(record, null, 2)}\n`,
  );
  return record;
}

function checkedRecord(root, candidate) {
  const directory = evidenceDirectory(root);
  const filename = path.join(directory, 'checks.json');
  if (!existsSync(filename))
    throw new Error(
      'No candidate command evidence. Run npm run check:prepare first.',
    );
  const record = JSON.parse(readFileSync(filename, 'utf8'));
  if (
    record.schemaVersion !== 1 ||
    !record.complete ||
    !sameCandidate(record, candidate) ||
    record.commands.length !== (requiresPinnedReview(root) ? 4 : 3) ||
    record.commands.some(
      (report) =>
        report.exitCode !== 0 ||
        !existsSync(path.join(root, report.log)) ||
        hashFile(root, report.log) !== report.logHash,
    )
  ) {
    throw new Error(
      'Command evidence is incomplete, failed or stale for the current candidate.',
    );
  }
  return record;
}

export function recordReview(
  root,
  { reviewer, summary, kind, findings: findingsPath },
) {
  if (
    !reviewer ||
    !summary ||
    !findingsPath ||
    !['independent-agent', 'structured-self-review', 'human'].includes(kind)
  )
    throw new Error(
      'Provide --reviewer, --summary, --findings=<JSON-file> and --kind=independent-agent|structured-self-review|human. This records review, not its truth.',
    );
  const candidate = snapshot(root);
  const checks = checkedRecord(root, candidate);
  const findings = JSON.parse(
    readFileSync(path.resolve(root, findingsPath), 'utf8'),
  );
  validateFindings(findings);
  const review = {
    schemaVersion: 1,
    ...candidate,
    reviewer,
    kind,
    summary,
    findings,
    commands: checks.commands,
    recordedAt: new Date().toISOString(),
    checksRecordedAt: checks.recordedAt,
  };
  writeFileSync(
    path.join(evidenceDirectory(root), 'review.json'),
    `${JSON.stringify(review, null, 2)}\n`,
  );
  return review;
}

function validateFindings(findings) {
  if (!Array.isArray(findings))
    throw new Error(
      'Findings must be an explicit array, including [] when none were found.',
    );
  for (const finding of findings) {
    if (
      !['critical', 'high', 'medium', 'low', 'info'].includes(
        finding.severity,
      ) ||
      !finding.file ||
      !Number.isInteger(finding.line) ||
      finding.line < 1 ||
      !finding.summary ||
      !finding.resolution
    )
      throw new Error(
        'Each finding needs severity, file, line, summary and resolution.',
      );
    if (
      ['critical', 'high'].includes(finding.severity) &&
      finding.resolution !== 'resolved'
    )
      throw new Error(
        'Unresolved high/critical findings block review acceptance.',
      );
  }
}

export function verifyReview(root) {
  const candidate = snapshot(root);
  const checks = checkedRecord(root, candidate);
  const filename = path.join(evidenceDirectory(root), 'review.json');
  if (!existsSync(filename))
    throw new Error(
      'Fresh read-only candidate review is required. Record it after reviewing actual outputs.',
    );
  const review = JSON.parse(readFileSync(filename, 'utf8'));
  if (
    review.schemaVersion !== 1 ||
    !sameCandidate(review, candidate) ||
    !review.reviewer ||
    !review.summary ||
    !['independent-agent', 'structured-self-review', 'human'].includes(
      review.kind,
    )
  )
    throw new Error(
      'Review is missing required fields, unresolved, or stale for the current candidate.',
    );
  validateFindings(review.findings);
  const reviewedAt = Date.parse(review.recordedAt);
  if (
    !Number.isFinite(reviewedAt) ||
    reviewedAt < Date.parse(review.checksRecordedAt) ||
    Date.now() - reviewedAt > 24 * 60 * 60 * 1000 ||
    review.checksRecordedAt !== checks.recordedAt
  )
    throw new Error(
      'Review timing is stale or does not match the current command evidence.',
    );
  return {
    candidateTree: candidate.candidateTree,
    reviewer: review.reviewer,
    kind: review.kind,
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [operation, ...rest] = process.argv.slice(2);
  const options = Object.fromEntries(
    rest.map((argument) => {
      const separator = argument.indexOf('=');
      return [argument.slice(2, separator), argument.slice(separator + 1)];
    }),
  );
  const root = process.cwd();
  try {
    if (operation === 'prepare') prepareEvidence(root);
    else if (operation === 'record-review')
      console.log(JSON.stringify(recordReview(root, options), null, 2));
    else if (operation === 'review')
      console.log(JSON.stringify(verifyReview(root), null, 2));
    else if (operation === 'commit') {
      // Verification evidence is prepared and reviewed before entering this hook.
      console.log(JSON.stringify(verifyReview(root), null, 2));
      const candidate = snapshot(root);
      const staged = run(root, 'npm', ['run', 'staged:check'], true);
      process.stdout.write(staged.output);
      if (staged.exitCode !== 0)
        throw new Error('Read-only staged hygiene failed.');
      const docs = checkDocumentation({
        root,
        mode: 'candidate',
        tree: candidate.candidateTree,
      });
      if (docs.errors.length) throw new Error(docs.errors.join('\n'));
      if (requiresPinnedReview(root)) {
        const integration = checkDocumentation({
          root,
          mode: 'pinned',
          tree: candidate.candidateTree,
          scope: 'all',
        });
        if (integration.errors.length)
          throw new Error(integration.errors.join('\n'));
      }
      if (!sameCandidate(candidate, snapshot(root)))
        throw new Error('Candidate changed during commit checks.');
    } else if (operation === 'push') {
      assertCommittedInputs(root);
      const check = run(root, 'npm', ['run', 'check'], true);
      process.stdout.write(check.output);
      if (check.exitCode !== 0)
        throw new Error('Root deterministic checks failed.');
      const result = checkDocumentation({
        root,
        mode: 'pinned',
        tree: 'HEAD',
        scope: 'all',
      });
      if (result.errors.length) throw new Error(result.errors.join('\n'));
      console.log(result.label);
    } else
      throw new Error(
        'Expected prepare, record-review, review, commit or push.',
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
