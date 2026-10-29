# Shared quality gates

ID: BRK-QA-001

Owner/scope: Integration root

Status: Specified

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

## Required stages

| Stage               | Owning repository obligation                                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Before dependencies | Exact package/tool API, support, license, issue/advisory and alternative review.                                                                               |
| Pre-commit          | Staged hygiene/format/lint, applicable architecture/core/type/component checks, local links, fresh candidate review/evidence; refuse relevant unstaged inputs. |
| Commit message      | Conventional Commit type/scope/shape; English remains a reviewer responsibility.                                                                               |
| Pre-push            | Full deterministic checks, static production build and critical browser smoke tests; root checks pinned integration.                                           |
| CI                  | Frozen install, complete required jobs and explicit final gate failing unexpected skips/failures; run against exact revisions.                                 |

Frontend details belong to [local quality](../brikuma-frontend/docs/engineering/QUALITY.md). Root checks only root-owned docs/metadata, registered gitlinks and candidate-tree cross-links; it does not format or commit children. Backend/infrastructure require local documentation/privacy hooks and `docs-required-gate`; application runtime tooling remains deferred.

Hooks are mandatory in active root/frontend tooling repositories and installed independently. Existing hook setups must be composed safely. No global Git setting, network package download, model call, arbitrary script approval or lockfile change occurs inside a hook. Hooks can be bypassed by Git; agents must not bypass them and CI is the enforcement boundary.

A passing working tree does not validate a different index. Evidence records identity, base/tree, toolchain/lock hash, executed command, exit code, environment/time and logs. A changed candidate invalidates review. The record checks consistency, not reviewer honesty. A review cannot replace deterministic checks.

Known relevant high/critical advisories block delivery. Unknown registry status is not checked. No zero-bug, certified-security, physical-validation or field-CWV claims are permitted. Public preparation on GitHub Free is authorized; private ruleset enforcement remains blocked by the account plan; the [configuration status below](#private-github-repositories-and-main-protection) distinguishes requested rules from enforcement.

Related: [review policy](ai/REVIEW_POLICY.md), [contributing](../CONTRIBUTING.md), [sources](SOURCES.md). Source: execution brief §§18–19.

## Implemented offline root documentation guard

[docs-check.mjs](../scripts/docs-check.mjs) checks Markdown file/anchor links, linked source/test file existence, explicit instruction imports/cycles and wiki reachability. [Guard tests](../scripts/docs-check.test.mjs) exercise valid links, dangling files/anchors, undeclared cross-repository links, orphan pages/import cycles, missing registration, invalid gitlink mode, unavailable pinned objects and exact-tree isolation. A valid file link cannot prove a prose claim or an exported API exists; semantic review remains required.

```sh
node scripts/docs-check.mjs
node scripts/docs-check.mjs --scope=all
node --test scripts/docs-check.test.mjs
node scripts/docs-check.mjs --mode=candidate --tree=<candidate-root-tree>
node scripts/docs-check.mjs --mode=pinned --tree=<candidate-root-tree> --scope=all
```

The default checks current root documentation with explicit working-tree context and is not integration verification. Root-only candidate mode reads the exact root Git tree and reports declared child links as unavailable until a pinned integration can resolve them. Strict pinned mode reads registered mode-160000 child commits and fails missing registration, unapproved URLs or unavailable objects; it never substitutes dirty child worktrees. The [exact link policy](link-policy.json) lists the three approved private GitHub child URLs. The policy is reviewed when a cross-repository link changes, not blanket permission for parent-relative paths.

Ten guard tests passed on 2026-09-24 using Node 22.23.2 and Git 2.54.0 (Apple Git-157), approximately 1.1 seconds. This is working-tree guard evidence, not a candidate-commit review or installed-hook assertion. Application tests and root hook bootstrap are separate gates.

## Root hooks, evidence and CI

The root independently installs exact local tools from [its manifest](../package.json) and [dependency record](DEPENDENCIES.md). `.npmrc` blocks lifecycle scripts during installation; explicitly run `npm run prepare` after source/script review. Actual repository-local hooksPath is `.husky/_`; pre-commit, commit-msg and pre-push are installed. [Disposable hook tests](../scripts/hooks.test.mjs) passed in a fresh temporary clone, including a real valid commit; no malformed commit was created in the user's repositories. Backend/infrastructure now own independent documentation/privacy hooks; application hooks remain deferred.

[quality.mjs](../scripts/quality.mjs) refuses relevant unstaged or untracked inputs, captures `git write-tree`, runs real staged formatting/candidate docs/guard tests, saves command output under ignored `artifacts/quality/`, and verifies matching review. [Evidence tests](../scripts/quality.test.mjs) prove changed candidates and unstaged fixes are rejected without deleting work. The flat evidence format shares `schemaVersion`, repository/base/tree, lock hash, Node/npm versions, timestamp, reviewer/findings and command/exit/log fields with frontend tooling; root also records input/environment hashes. This format checks consistency, never an agent's truthfulness.

After staging explicit intended files, run `npm run check:prepare`. Review the exact tree and logs read-only; write an explicit findings array in ignored evidence (including `[]` when none). Then record it with `npm run review:record -- --reviewer=<name> --kind=independent-agent --summary=<factual-summary> --findings=artifacts/quality/findings.json`. Use `structured-self-review` when independence is unavailable. `npm run review:check` and pre-commit require the same candidate and fresh evidence; any input/base change requires re-preparation/review. No external model or install runs in hooks.

[Root CI](../.github/workflows/quality.yml) separates root docs/tooling from strict pinned integration, uses exact reviewed action SHAs, read-only permissions and timeouts. `root-required-gate` fails mandatory job failures/skips or absent completion output. `root-docs-and-tooling` validates root policy independently; `pinned-integration` checks registered child commits and the pinned frontend's independent install/check/build. Authentication for private children is described below. A workflow file is not proof that GitHub has run it or made its final gate mandatory.

Pre-push also requires relevant root working/index inputs to match committed `HEAD`, so an uncommitted tooling change cannot validate a different published revision. The seven staged/evidence tests include this refusal and reject an unstaged `.prettierignore` change that could otherwise suppress formatting checks. The latter regression was identified by the separate read-only reviewer and fixed before the root commit. The disposable hook harness clears Node's inherited test-worker recursion marker before spawning nested checks and asserts those checks actually execute. This is test-process isolation, not a skipped gate or disabled hook.

## Private GitHub repositories and main protection

The 2026-09-25 private bootstrap remains historical evidence. The owner's 2026-10-29 plan selects public repositories on GitHub Free after a complete privacy audit and a separate final authorization. See the canonical [publication policy](PUBLICATION.md) for the two independent rulesets, zero required external approvals, required check names and acceptance probes.

The prepared root workflow reads exact gitlinks and checks out public child revisions without deploy keys. It is intentionally not evidence that private child integration can run without credentials. Existing private read keys/secrets remain necessary until the children are public and the replacement integration succeeds; remove them only at that verified transition.

All four repositories require the new standalone `privacy` workflow in addition to their owning quality gate. Its PR scanner/configuration/tool lock comes from the exact base SHA. Scanner/workflow/dependency edits also require local review and testing of the exact candidate SHA. Full historical scans run before publication and weekly. [Privacy setup](../PRIVACY.md) owns executable commands and limitations. Weekly repository drift checks do not claim full organization/UI coverage.
