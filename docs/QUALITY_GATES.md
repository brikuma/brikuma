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

Frontend details belong to [local quality](../brikuma-frontend/docs/engineering/QUALITY.md). Root checks only root-owned docs/metadata, registered gitlinks and candidate-tree cross-links; it does not format or commit children. Backend/infrastructure need document and commit review now; full hooks are deferred until application tooling exists.

Hooks are mandatory in active root/frontend tooling repositories and installed independently. Existing hook setups must be composed safely. No global Git setting, network package download, model call, arbitrary script approval or lockfile change occurs inside a hook. Hooks can be bypassed by Git; agents must not bypass them and CI is the enforcement boundary.

A passing working tree does not validate a different index. Evidence records identity, base/tree, toolchain/lock hash, executed command, exit code, environment/time and logs. A changed candidate invalidates review. The record checks consistency, not reviewer honesty. A review cannot replace deterministic checks.

Known relevant high/critical advisories block delivery. Unknown registry status is not checked. No zero-bug, certified-security, physical-validation or field-CWV claims are permitted. Remote protection is authorized but remains blocked by the current GitHub account plan; the [configuration status below](#private-github-repositories-and-main-protection) distinguishes requested rules from enforcement.

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

The root independently installs exact local tools from [its manifest](../package.json) and [dependency record](DEPENDENCIES.md). `.npmrc` blocks lifecycle scripts during installation; explicitly run `npm run prepare` after source/script review. Actual repository-local hooksPath is `.husky/_`; pre-commit, commit-msg and pre-push are installed. [Disposable hook tests](../scripts/hooks.test.mjs) passed in a fresh temporary clone, including a real valid commit; no malformed commit was created in the user's repositories. Backend/infrastructure full hooks remain deferred.

[quality.mjs](../scripts/quality.mjs) refuses relevant unstaged or untracked inputs, captures `git write-tree`, runs real staged formatting/candidate docs/guard tests, saves command output under ignored `artifacts/quality/`, and verifies matching review. [Evidence tests](../scripts/quality.test.mjs) prove changed candidates and unstaged fixes are rejected without deleting work. The flat evidence format shares `schemaVersion`, repository/base/tree, lock hash, Node/npm versions, timestamp, reviewer/findings and command/exit/log fields with frontend tooling; root also records input/environment hashes. This format checks consistency, never an agent's truthfulness.

After staging explicit intended files, run `npm run check:prepare`. Review the exact tree and logs read-only; write an explicit findings array in ignored evidence (including `[]` when none). Then record it with `npm run review:record -- --reviewer=<name> --kind=independent-agent --summary=<factual-summary> --findings=artifacts/quality/findings.json`. Use `structured-self-review` when independence is unavailable. `npm run review:check` and pre-commit require the same candidate and fresh evidence; any input/base change requires re-preparation/review. No external model or install runs in hooks.

[Root CI](../.github/workflows/quality.yml) separates root docs/tooling from strict pinned integration, uses exact reviewed action SHAs, read-only permissions and timeouts. `root-required-gate` fails mandatory job failures/skips or absent completion output. `root-docs-and-tooling` validates root policy independently; `pinned-integration` checks registered child commits and the pinned frontend's independent install/check/build. Authentication for private children is described below. A workflow file is not proof that GitHub has run it or made its final gate mandatory.

Pre-push also requires relevant root working/index inputs to match committed `HEAD`, so an uncommitted tooling change cannot validate a different published revision. The seven staged/evidence tests include this refusal and reject an unstaged `.prettierignore` change that could otherwise suppress formatting checks. The latter regression was identified by the separate read-only reviewer and fixed before the root commit. The disposable hook harness clears Node's inherited test-worker recursion marker before spawning nested checks and asserts those checks actually execute. This is test-process isolation, not a skipped gate or disabled hook.

## Private GitHub repositories and main protection

The owner authorized private publication on 2026-09-25 and selected a solo-development workflow with pull requests and CI required, without approval from a second person. The requested `main` policy is:

- Require a pull request before merging, with zero required external approvals; local independent candidate review remains required.
- Require successful, up-to-date CI: `root-required-gate` for the root and `required` for the frontend. Backend/infrastructure are documentation-only; no nonexistent application check is claimed for them.
- Resolve review conversations before merging; prevent force pushes, branch deletion and administrator bypass.
- Preserve linear history through an allowed squash or rebase merge strategy.

**Current enforcement: blocked.** GitHub returned HTTP 403 when private branch protection was requested under the account's current plan. GitHub documents private-repository protection as a paid-plan capability. The repositories remain private; changing visibility or purchasing a plan requires a separate owner decision. Pull requests and CI can be used now, but GitHub does not yet enforce the requested merge restrictions. After an eligible plan is available, configure the rules, read them back through the API and verify the exact required check names before claiming protection is active.

Root Actions uses one read-only deploy key per private child, stored as root repository Actions secrets `BRIKUMA_FRONTEND_READ_KEY`, `BRIKUMA_BACKEND_READ_KEY` and `BRIKUMA_INFRASTRUCTURE_READ_KEY`. Each key is restricted to its child repository. The workflow reads the root's selected gitlink commits and checks out those exact revisions; it does not advance to a child's latest branch. Credential values must never be committed or copied into evidence. The root `GITHUB_TOKEN` remains read-only and is not assumed to grant access to other private repositories. A run without the required child credentials must fail visibly rather than skip pinned integration.

Publication evidence is recorded under ignored `artifacts/github-project/`, including actual command outcomes and remote state. The repository topology, workflow and secrets are configuration; only completed check logs and GitHub run results establish validation. Historical bootstrap evidence above remains a record of its original checkpoint, not validation of a later registered tree.

Sources checked 2026-09-25: [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys).
