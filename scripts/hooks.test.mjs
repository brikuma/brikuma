import assert from 'node:assert/strict';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { recordReview } from './quality.mjs';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function execute(root, command, args, expected = 0) {
  // Child `node --test` processes must start a new harness rather than inherit
  // this test worker's recursive-run marker and silently skip their test files.
  const environment = { ...process.env };
  delete environment.NODE_TEST_CONTEXT;
  const result = spawnSync(command, args, {
    cwd: root,
    env: environment,
    encoding: 'utf8',
    timeout: 60000,
  });
  if (expected !== null)
    assert.equal(
      result.status,
      expected,
      `${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`,
    );
  return result;
}

test(
  'fresh disposable clone installs actual hooks, rejects bad candidates/messages and commits a reviewed candidate',
  { timeout: 60000 },
  (t) => {
    assert.ok(
      existsSync(path.join(source, 'node_modules/husky/bin.js')),
      'Install researched root dependencies before hook verification.',
    );
    const temporary = mkdtempSync(path.join(tmpdir(), 'brikuma-root-hooks-'));
    t.after(() => rmSync(temporary, { recursive: true, force: true }));
    const seed = path.join(temporary, 'seed');
    const clone = path.join(temporary, 'clone');
    mkdirSync(seed);
    for (const name of [
      'package.json',
      'privacy-policy.json',
      'gitleaks.lock.json',
      'package-lock.json',
      '.node-version',
      '.npmrc',
      'prettier.config.mjs',
      'lint-staged.config.mjs',
      'commitlint.config.mjs',
      '.prettierignore',
      'scripts',
    ])
      cpSync(path.join(source, name), path.join(seed, name), {
        recursive: true,
      });
    mkdirSync(path.join(seed, '.husky'));
    for (const hook of ['pre-commit', 'commit-msg', 'pre-push'])
      cpSync(
        path.join(source, '.husky', hook),
        path.join(seed, '.husky', hook),
      );
    writeFileSync(
      path.join(seed, '.gitignore'),
      'node_modules/\nartifacts/\n.tools/\n',
    );
    writeFileSync(path.join(seed, 'README.md'), '# Disposable fixture\n');
    mkdirSync(path.join(seed, 'docs'));
    writeFileSync(path.join(seed, 'docs/README.md'), '# Documentation\n');
    writeFileSync(
      path.join(seed, 'docs/link-policy.json'),
      '{\n  "version": 1,\n  "conditionalLinks": [],\n  "approvedSubmodules": []\n}\n',
    );
    execute(seed, 'git', ['init', '-q']);
    execute(seed, 'git', ['add', '--all']);
    execute(seed, 'git', [
      '-c',
      'user.name=Disposable Hook Test',
      '-c',
      'user.email=' + '123+hooks@users.noreply.github.com',
      'commit',
      '-qm',
      'docs(project): create disposable bootstrap',
    ]);
    execute(temporary, 'git', ['clone', '--quiet', seed, clone]);
    // Dependency reuse is confined to this disposable hook test, never a product repository dependency.
    symlinkSync(
      path.join(source, 'node_modules'),
      path.join(clone, 'node_modules'),
      'dir',
    );
    cpSync(path.join(source, '.tools'), path.join(clone, '.tools'), {
      recursive: true,
    });
    execute(clone, 'git', [
      'config',
      'user.email',
      '123+hooks@users.noreply.github.com',
    ]);
    execute(clone, 'git', ['config', 'user.name', 'Disposable Hook Test']);
    execute(clone, 'npm', ['run', 'prepare']);
    assert.equal(
      execute(clone, 'git', [
        'config',
        '--get',
        'core.hooksPath',
      ]).stdout.trim(),
      '.husky/_',
    );

    writeFileSync(path.join(clone, 'README.md'), '# Reviewed fixture\n');
    execute(clone, 'git', ['add', 'README.md']);
    const noReview = execute(clone, 'git', ['hook', 'run', 'pre-commit'], null);
    assert.notEqual(noReview.status, 0);
    assert.match(
      `${noReview.stdout}${noReview.stderr}`,
      /No candidate command evidence/,
    );

    writeFileSync(
      path.join(clone, 'message.txt'),
      'not a conventional message\n',
    );
    const malformed = execute(
      clone,
      'git',
      ['hook', 'run', 'commit-msg', '--', 'message.txt'],
      null,
    );
    assert.notEqual(malformed.status, 0);
    assert.match(
      `${malformed.stdout}${malformed.stderr}`,
      /type.*empty|subject.*empty/,
    );

    writeFileSync(path.join(clone, 'README.md'), '# Unstaged fix\n');
    const unstaged = execute(clone, 'git', ['hook', 'run', 'pre-commit'], null);
    assert.notEqual(unstaged.status, 0);
    assert.match(
      `${unstaged.stdout}${unstaged.stderr}`,
      /inputs differ from the index/,
    );
    assert.equal(
      readFileSync(path.join(clone, 'README.md'), 'utf8'),
      '# Unstaged fix\n',
    );
    execute(clone, 'git', ['add', 'README.md']);

    const prepared = execute(clone, 'npm', ['run', 'check:prepare']);
    assert.match(
      prepared.stdout,
      /Subtest: staged candidate relying on an unstaged fix/,
    );
    assert.doesNotMatch(
      `${prepared.stdout}${prepared.stderr}`,
      /skipping running files/,
    );
    writeFileSync(path.join(clone, 'artifacts/quality/findings.json'), '[]\n');
    recordReview(clone, {
      reviewer: 'disposable-test-fixture',
      kind: 'structured-self-review',
      summary:
        'Test fixture review record; not an application correctness review.',
      findings: 'artifacts/quality/findings.json',
    });
    execute(clone, 'git', [
      '-c',
      'user.name=Disposable Hook Test',
      '-c',
      'user.email=' + '123+hooks@users.noreply.github.com',
      'commit',
      '-m',
      'docs(project): update reviewed fixture',
    ]);
    assert.equal(
      execute(clone, 'git', ['log', '-1', '--format=%s']).stdout.trim(),
      'docs(project): update reviewed fixture',
    );
    assert.equal(
      readFileSync(path.join(clone, 'message.txt'), 'utf8'),
      'not a conventional message\n',
    );
  },
);
