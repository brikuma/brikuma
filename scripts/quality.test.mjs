import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import {
  assertCommittedInputs,
  assertStagedInputs,
  relevant,
  sameCandidate,
  snapshot,
  verifyReview,
} from './quality.mjs';

function repository(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'brikuma-evidence-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const run = (...args) => {
    const result = spawnSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  run('init', '-q');
  writeFileSync(path.join(root, '.gitignore'), 'artifacts/\n');
  writeFileSync(path.join(root, 'README.md'), '# Original\n');
  run('add', '.gitignore', 'README.md');
  return { root, run };
}

test('staged candidate relying on an unstaged fix is rejected without deleting it', (t) => {
  const { root } = repository(t);
  writeFileSync(path.join(root, 'README.md'), '# Unstaged fix\n');
  assert.throws(() => assertStagedInputs(root), /inputs differ from the index/);
  assert.equal(
    readFileSync(path.join(root, 'README.md'), 'utf8'),
    '# Unstaged fix\n',
  );
});

test('relevant untracked inputs reject, unrelated notes remain untouched', (t) => {
  const { root } = repository(t);
  writeFileSync(path.join(root, 'personal.txt'), 'personal note');
  assert.doesNotThrow(() => assertStagedInputs(root));
  writeFileSync(path.join(root, 'extra.mjs'), 'export const changed = true;');
  assert.throws(() => assertStagedInputs(root), /extra.mjs/);
  assert.equal(
    readFileSync(path.join(root, 'personal.txt'), 'utf8'),
    'personal note',
  );
});

test('an unstaged formatter ignore change cannot bypass candidate checks', (t) => {
  const { root, run } = repository(t);
  writeFileSync(path.join(root, '.prettierignore'), 'artifacts/\n');
  run('add', '.prettierignore');
  assert.doesNotThrow(() => assertStagedInputs(root));
  writeFileSync(path.join(root, '.prettierignore'), '*\n');
  assert.throws(() => assertStagedInputs(root), /\.prettierignore/);
  assert.equal(readFileSync(path.join(root, '.prettierignore'), 'utf8'), '*\n');
});

test('new staged tree invalidates candidate evidence', (t) => {
  const { root, run } = repository(t);
  const before = snapshot(root);
  writeFileSync(path.join(root, 'README.md'), '# Candidate changed\n');
  run('add', 'README.md');
  assert.equal(sameCandidate(before, snapshot(root)), false);
});

test('push verification accepts committed inputs and rejects a different staged tree', (t) => {
  const { root, run } = repository(t);
  assert.throws(() => assertCommittedInputs(root), /committed HEAD tree/);
  run(
    '-c',
    'user.name=Disposable Quality Test',
    '-c',
    'user.email=quality@example.invalid',
    'commit',
    '-m',
    'docs(project): create committed fixture',
  );
  assert.doesNotThrow(() => assertCommittedInputs(root));
  writeFileSync(path.join(root, 'README.md'), '# Later staged change\n');
  run('add', 'README.md');
  assert.throws(() => assertCommittedInputs(root), /committed HEAD tree/);
});

test('missing candidate review never passes as a no-op', (t) => {
  const { root } = repository(t);
  assert.throws(() => verifyReview(root), /No candidate command evidence/);
});

test('root input selection excludes independent children and includes hook/toolchain inputs', () => {
  assert.equal(relevant('brikuma-frontend/src/app/page.tsx'), false);
  assert.equal(relevant('.husky/pre-commit'), true);
  assert.equal(relevant('package-lock.json'), true);
  assert.equal(relevant('.prettierignore'), true);
});
