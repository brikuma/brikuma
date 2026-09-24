# Contributing

Read [AGENTS.md](AGENTS.md) and the owning repository's instructions. Work in the owner; do not import across repositories. Follow the [repository workflow](docs/REPOSITORIES.md) and [quality gates](docs/QUALITY_GATES.md).

Use English Conventional Commits: `type(scope): imperative summary`. Root scopes: `project`, `docs`, `spec`, `architecture`, `quality`, `tooling`, `submodules`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Prefer summaries of at most 72 characters. Do not invent an author identity.

Before a commit, inspect status and staged diff; stage only intended paths; verify candidate inputs match the index; run applicable checks; obtain a fresh read-only candidate review. An unstaged fix cannot validate staged broken code. Never bypass hooks, weaken checks to pass, auto-force dependency fixes, or combine unrelated changes.

Child changes are committed before a root pin update. A root pin update must reference an existing reviewed child commit. Publishing remains separately authorized. Remote branch protection is owner configuration; workflow files do not enable it.

[Documentation rules](docs/DOCUMENTATION_RULES.md) · [Review policy](docs/ai/REVIEW_POLICY.md)
