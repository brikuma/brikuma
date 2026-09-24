# Repositories and integration

ID: BRK-REPO-001

Owner/scope: Integration root

Status: Blocked: remote registration

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

## Ownership and initial inspection

| Path                     | Owner                               | Initial state (2026-09-24)                           | Registration                          |
| ------------------------ | ----------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| Root                     | Global docs and quality integration | No root Git metadata at initial inspection           | Bootstrap in progress                 |
| `brikuma-frontend`       | Active Next.js frontend             | Existing `main`, initial commit `4f7a85c`; no remote | Blocked: approved remote URL required |
| `brikuma-backend`        | Deferred backend scope              | Documentation-only bootstrap                         | Blocked: approved remote URL required |
| `brikuma-infrastructure` | Deferred deployment scope           | Documentation-only bootstrap                         | Blocked: approved remote URL required |

The execution handoff records later Git state. Do not interpret this initial inventory as a current commit listing. Preserve the existing frontend identity and history. Root temporarily ignores the child paths until real registration is possible; an unregistered nested repository is not a submodule.

## Safe registration and clone workflow

Only register owner-approved real remotes. Never use invented hosts, absolute local URLs or unsafe protocol overrides. Registration requires `.gitmodules` path/URL entries, tree mode `160000`, and an available child commit. Remove only the corresponding temporary parent ignore when registration succeeds. If ordinary child sources are already root-tracked, migration requires approval.

After approved registration, use `git clone --recurse-submodules <approved-root-url>` or `git submodule update --init --recursive` for an existing clone. Initialization normally checks out the exact pinned commit, which may be detached. Inspect status and create or switch to an explicit named work branch before child edits; never force-move an existing branch. Do not use `git submodule update --remote` in reproducible CI.

Commit a coherent child change first. Validate its commit object, then stage only the corresponding root gitlink and relevant root docs. Root integration validates links against child commits pinned in the candidate root tree, never against uncommitted child files. Before an authorized publication, ensure every pinned child commit is available through the approved remotes. No push is authorized by this brief.

## Bootstrap and standalone behavior

Early docs/bootstrap checks must not require an unfinished frontend application. The frontend installs and builds from its own manifest/lockfile with no root runtime dependencies. Standalone local links are checked locally and absent parent/sibling governance is reported, not silently considered validated. Retrieve approved governance before policy-changing standalone work.

Sources accessed 2026-09-24: [Git submodules](https://git-scm.com/docs/gitsubmodules), [Git submodule commands](https://git-scm.com/docs/git-submodule). Related: [contributing](../CONTRIBUTING.md), [decision BRK-DEC-001](DECISIONS.md#brk-dec-001-independent-histories-and-registration).

## 2026-09-24 local bootstrap checkpoint

The root and documentation-only children were initialized as independent local Git repositories on `main`, preserving the existing frontend history. Backend committed `51e73cd` (`docs(docs): define deferred backend responsibilities`); infrastructure committed `1b8c92b` (`docs(docs): define deferred infrastructure responsibilities`). Their worktrees were clean after explicit staged-diff review, whitespace hygiene and cross-document checks. No runtime hook installation is claimed for those documentation-only children.

Frontend committed `ad95c84` (`feat(app): implement browser-local brick design preview`) after a separate read-only review of tree `6216f37688a4893d5a9676a07d66dee8c8106ed2` and passing deterministic gates. The original user-owned untracked `.agents/`, `.claude/` and `skills-lock.json` remain untouched; the committed frontend source is clean. Backend and infrastructure remain documentation-only at the commits above.

The root bootstrap candidate contains this ledger and the final root guard correction; its exact-tree review and local commit are recorded in the execution handoff and ignored quality evidence. No remote URLs, `.gitmodules` registration or gitlinks exist, and no push occurred. Root and frontend hooks are independently installed and tested as described in [quality](QUALITY_GATES.md); local nested repositories still do not constitute a portable submodule integration. The strict pinned-tree integration check was executed and correctly returned blocked because approved registration is absent.
