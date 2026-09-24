# Global decisions

ID: BRK-ADR-001

Owner/scope: Integration root

Status: Specified

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

## BRK-DEC-001 Independent histories and registration

Status: specified; registration blocked. Preserve the existing frontend Git history. Bootstrap independent local children without application implementations in backend/infrastructure. Approved remote URLs are unavailable, so no reproducible submodule registration or integration pin is claimed. Temporarily ignore child directories in the parent. [Repository workflow](REPOSITORIES.md) is canonical.

## BRK-DEC-002 Executable source baseline

Status: adopted. Use frontend execution brief 1.1.0 / consolidated v0.0.3. Original Word documents and the FORMA screenshot were absent at initial inspection; the shared ChatGPT page was initially unavailable and later inspected. The owner subsequently supplied D1/D2 Markdown sources and authorized frontend continuity corrections based on them. Mapping their actual identifiers is now supported; D3 and the original Word binaries remain unavailable. Preserve the narrower frontend-only execution boundary while recording broader product gaps. See [sources](SOURCES.md) and the [frontend decisions](../brikuma-frontend/docs/DECISIONS.md).

## BRK-DEC-003 Frontend-only scope

Status: adopted. Static browser-local behavior and explicitly fictional samples are sufficient for this POC. Backend/infrastructure remain documentation-only. No fake service, generated-model claim, payment/invitation success or safety score is permitted. See [architecture](ARCHITECTURE.md).

## BRK-DEC-004 Legal and governance context

Status: pending owner decision for project license, approved remotes, security contact and remote protections. Third-party notices remain intact. Root/child agent entry files link canonical policy; actual Claude loading is not verified by mere file presence.

Frontend implementation decisions are owned by the [frontend index](../brikuma-frontend/docs/DECISIONS.md).

The owner's 2026-09-24 UI/UX correction prioritizes detailed studio rendering and useful manual modeling. The [frontend studio decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-009-studio-rendering-and-direct-manual-editing) owns the implementation and expanded local editing contract; the frontend-only architecture remains in force.

The subsequent request for realistic stud spacing and underside cavities is owned by the [frontend connector geometry decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-010-nominal-brick-proportions-and-inspectable-connectors), including nominal proportions, original geometry and single-brick inspection without physical-validation claims.

The later rejection of the retro interface and arbitrary exploded view is addressed by the [contemporary workspace and assembly decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-011-contemporary-workspace-stud-feedback-and-authored-assemblies): connector-aware placement, precise free-form coordinates, explicit assembly modules and a compact neutral interface remain browser-local.

## BRK-DEC-005 npm and no global installations

Status: adopted by explicit subsequent user instruction. Use npm with independent owning-repository manifests and `package-lock.json`; install project-local dependencies only. No system-global package, global package-manager installation, root workspace or implicitly shared runtime is authorized. This current instruction supersedes the original brief's pnpm choice. The [frontend decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-006-npm-tooling-override) owns local setup consequences.
