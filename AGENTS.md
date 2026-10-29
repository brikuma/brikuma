# BRIKUMA project instructions

Read this entry before changing any owning repository. Policies here apply across the intended superproject checkout; child instructions add narrower implementation rules.

## Reading order

1. [Project context](docs/PROJECT_CONTEXT.md), [repository ownership](docs/REPOSITORIES.md), and [global architecture](docs/ARCHITECTURE.md).
2. The owning child's `AGENTS.md` and relevant specifications. Frontend work starts at [frontend instructions](brikuma-frontend/AGENTS.md).
3. Before review or a commit: [quality gates](docs/QUALITY_GATES.md), [review policy](docs/ai/REVIEW_POLICY.md), and [contribution workflow](CONTRIBUTING.md).
4. Update the canonical document and [decision index](docs/DECISIONS.md) when changing a rule; link rather than duplicate it.

## Shared rules

- All project-authored prose, interface copy, identifiers, comments, tests and commit messages are English. Preserve third-party notices verbatim.
- Implement the frontend only. Backend and infrastructure children currently own documentation/bootstrap metadata only.
- Keep free-form design first-class. Keep visual style, construction system, intended use and constraints distinct.
- The POC uses same-origin static assets and local browser interaction. No backend, fake HTTP service, real AI, payment, messaging, cloud sync or physical validation.
- Label fixtures and unconnected capabilities truthfully. No fabricated successful transaction, invitation, validation or generation.
- Resolve the actual working directory and Git root before writes, installs or Git operations. Preserve user changes and existing histories.
- The intended topology is independent Git submodules. Do not replace it with a workspace or double-track child source. Registration needs approved real remotes.
- Do not push, create remote repositories or rewrite remote history without explicit authorization. Authorized cleanup runs in isolated copies first. Never invent identity, alter global Git settings or disable gates.
- Research exact dependencies and tool APIs before installation. Audit resolved production and development trees; relevant high/critical findings block delivery.
- Use npm and repository-local dependencies/lockfiles per the later user override. Never install system-global packages or create a root workspace.
- Original material uses MIT; preserve third-party terms. Security reports use GitHub Private Vulnerability Reporting after activation. Public visibility needs final owner authorization; no deployment is approved. Follow [publication policy](docs/PUBLICATION.md). All shipped content must be demo-safe.
- Use Conventional Commits and review one coherent candidate tree in its owning repository. Stage explicit paths. Commit children before integration pins; no cross-repository atomic transaction exists.
- Record unknowns as not checked, not measured or blocked. A generated file is not proof that a tool ran successfully.

[Global documentation index](docs/README.md) · [Vocabulary](LEGEND.md)
