# Global architecture standards

ID: BRK-ARCH-001

Owner/scope: Integration root

Status: Specified

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

The integration root owns global policy and child revision selection. Each child owns its history, version, dependencies and local checks. A root commit selects an integration snapshot; it cannot atomically commit separate repositories. See [repository rules](REPOSITORIES.md).

Dependencies point inward toward implemented business rules. The frontend core is pure and independent of UI, platform and fixtures; its concrete boundaries and enforcement are owned by [frontend architecture](../brikuma-frontend/docs/engineering/ARCHITECTURE.md). There is no shared root source package or root workspace.

Only the frontend may implement application behavior in this assignment. Backend and infrastructure contain scope documentation only. Static fixture data is presentation input, not an API or repository impersonation. No future backend aggregate, network abstraction or speculative deployment stack is needed.

Prefer the smallest pattern that solves an implemented problem. Domain ownership needs human code review; import checks cannot prove semantic correctness. External dependency changes require version-specific evidence and compatibility checks in the owning repository.

Sources: execution brief §§2–5; [Git submodules](https://git-scm.com/docs/gitsubmodules); [Clean Architecture dependency rule](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) is a starting reference, not independently reviewed here. Related: [quality](QUALITY_GATES.md), [decisions](DECISIONS.md).
