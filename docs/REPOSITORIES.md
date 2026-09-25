# Repositories and integration

ID: BRK-REPO-001

Owner/scope: Integration root

Status: Registered private repositories; branch protection blocked by account plan

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

## Current ownership and approved remotes

The owner authorized private GitHub publication and clarified the complete project topology on 2026-09-25. `brikuma` is the project entry point, with three independent child histories pinned as submodules. The frontend repository alone contains the application; it is not the complete integration checkout.

| Path                     | Owner                                         | Approved private remote                                        |
| ------------------------ | --------------------------------------------- | -------------------------------------------------------------- |
| Root                     | Global docs and quality integration           | `https://github.com/MatteoVincenti/brikuma.git`                |
| `brikuma-frontend`       | Active Next.js frontend                       | `https://github.com/MatteoVincenti/brikuma-frontend.git`       |
| `brikuma-backend`        | Deferred backend scope; documentation only    | `https://github.com/MatteoVincenti/brikuma-backend.git`        |
| `brikuma-infrastructure` | Deferred deployment scope; documentation only | `https://github.com/MatteoVincenti/brikuma-infrastructure.git` |

[`.gitmodules`](../.gitmodules) declares the child paths and remote URLs; the root Git tree selects each exact commit with mode `160000`. The [link policy](link-policy.json) permits those same approved URLs. Child source files are not tracked again by the root, and this arrangement does not create a package workspace.

The initial registration selects frontend `0c86c23f873d3dd6bf69ad7c9d5bbbfedd8bfff2`, backend `6ad4dfe84027ae059cefdbd44aef98740291a910`, and infrastructure `a3b1d826db0b3f14f140e01da82d118438562a6e`. Later root commits may select newer children; inspect `git submodule status` and the root tree for the current snapshot. All four repositories must remain private. [Branch protection status](QUALITY_GATES.md#private-github-repositories-and-main-protection) is separate from successful registration.

## Safe registration and clone workflow

Only register owner-approved real remotes. Never use invented hosts, absolute local URLs or unsafe protocol overrides. Registration requires `.gitmodules` path/URL entries, tree mode `160000`, and an available child commit. Remove only the corresponding temporary parent ignore when registration succeeds. If ordinary child sources are already root-tracked, migration requires approval.

Use `git clone --recurse-submodules https://github.com/MatteoVincenti/brikuma.git` or `git submodule update --init --recursive` for an existing root clone. Authenticate with access to all four private repositories. Initialization normally checks out the exact pinned commit, which may be detached. Inspect status and create or switch to an explicit named work branch before child edits; never force-move an existing branch. Do not use `git submodule update --remote` in reproducible CI.

Commit a coherent child change first, run its owning checks and publish the reviewed child commit under the authorized workflow. Validate its commit object, then stage only the corresponding root gitlink and relevant root docs. Root integration validates links against child commits pinned in the candidate root tree, never against uncommitted child files. Before publishing the root, ensure every pinned child commit is available through the approved remotes. The owner's explicit 2026-09-25 request authorizes this initial private publication; it does not provide blanket permission for unrelated future remote changes. See [BRK-DEC-006](DECISIONS.md#brk-dec-006-private-project-publication-and-solo-development-policy).

For ongoing work, use a named child branch and pull request for a child change, then a root branch and pull request updating its pin after the child commit is available. Required checks belong to the owning repository. Root integration selects and verifies a combination of revisions; a child push does not silently advance that selection. Remote enforcement of this intended workflow remains blocked as documented in [quality gates](QUALITY_GATES.md#private-github-repositories-and-main-protection).

## Bootstrap and standalone behavior

Early docs/bootstrap checks must not require an unfinished frontend application. The frontend installs and builds from its own manifest/lockfile with no root runtime dependencies. Standalone local links are checked locally and absent parent/sibling governance is reported, not silently considered validated. Retrieve approved governance before policy-changing standalone work.

Sources accessed 2026-09-24: [Git submodules](https://git-scm.com/docs/gitsubmodules), [Git submodule commands](https://git-scm.com/docs/git-submodule). Related: [contributing](../CONTRIBUTING.md), [decision BRK-DEC-001](DECISIONS.md#brk-dec-001-independent-histories-and-registration).

## Historical 2026-09-24 local bootstrap checkpoint

This section records the initial local-only state, before the owner approved private publication. It does not describe current registration.

The root and documentation-only children were initialized as independent local Git repositories on `main`, preserving the existing frontend history. Backend committed `51e73cd` (`docs(docs): define deferred backend responsibilities`); infrastructure committed `1b8c92b` (`docs(docs): define deferred infrastructure responsibilities`). Their worktrees were clean after explicit staged-diff review, whitespace hygiene and cross-document checks. No runtime hook installation is claimed for those documentation-only children.

Frontend committed `ad95c84` (`feat(app): implement browser-local brick design preview`) after a separate read-only review of tree `6216f37688a4893d5a9676a07d66dee8c8106ed2` and passing deterministic gates. The original user-owned untracked `.agents/`, `.claude/` and `skills-lock.json` remain untouched; the committed frontend source is clean. Backend and infrastructure remain documentation-only at the commits above.

The root bootstrap candidate contained this ledger and the final root guard correction; its exact-tree review and local commit were recorded in the execution handoff and ignored quality evidence. At that checkpoint no remote URLs, `.gitmodules` registration or gitlinks existed, and no push occurred. Root and frontend hooks were independently installed and tested as described in [quality](QUALITY_GATES.md). The strict pinned-tree integration check correctly returned blocked because approved registration was absent. The later registration above supersedes that blocker without rewriting the child histories.
