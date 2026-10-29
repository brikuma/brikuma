# Global decisions

ID: BRK-ADR-001

Owner/scope: Integration root

Status: Specified

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

## BRK-DEC-001 Independent histories and registration

Status: adopted; approved registration implemented on 2026-09-25. Preserve independent child histories and keep backend/infrastructure documentation-only. The initial missing-remotes blocker is resolved by the owner's later publication authorization, recorded in BRK-DEC-006. The root now selects child revisions with Git submodules instead of temporarily ignoring those directories. [Repository workflow](REPOSITORIES.md) is canonical.

## BRK-DEC-002 Executable source baseline

Status: adopted. Use frontend execution brief 1.1.0 / consolidated v0.0.3. Original Word documents and the FORMA screenshot were absent at initial inspection; the shared ChatGPT page was initially unavailable and later inspected. The owner subsequently supplied D1/D2 Markdown sources and authorized frontend continuity corrections based on them. Mapping their actual identifiers is now supported; D3 and the original Word binaries remain unavailable. Preserve the narrower frontend-only execution boundary while recording broader product gaps. See [sources](SOURCES.md) and the [frontend decisions](../brikuma-frontend/docs/DECISIONS.md).

## BRK-DEC-003 Frontend-only scope

Status: adopted. Static browser-local behavior and explicitly fictional samples are sufficient for this POC. Backend/infrastructure remain documentation-only. No fake service, generated-model claim, payment/invitation success or safety score is permitted. See [architecture](ARCHITECTURE.md).

## BRK-DEC-004 Legal and governance context

Status: original licensing/contact decisions were superseded by BRK-DEC-007; MIT and Private Vulnerability Reporting are now approved. Approved private remotes and the requested solo-development protection policy are recorded in BRK-DEC-006; GitHub plan restrictions still block remote enforcement. Third-party notices remain intact. Root/child agent entry files link canonical policy; actual Claude loading is not verified by mere file presence.

Frontend implementation decisions are owned by the [frontend index](../brikuma-frontend/docs/DECISIONS.md).

The owner's 2026-09-24 UI/UX correction prioritizes detailed studio rendering and useful manual modeling. The [frontend studio decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-009-studio-rendering-and-direct-manual-editing) owns the implementation and expanded local editing contract; the frontend-only architecture remains in force.

The subsequent request for realistic stud spacing and underside cavities is owned by the [frontend connector geometry decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-010-nominal-brick-proportions-and-inspectable-connectors), including nominal proportions, original geometry and single-brick inspection without physical-validation claims.

The later rejection of the retro interface and arbitrary exploded view is addressed by the [contemporary workspace and assembly decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-011-contemporary-workspace-stud-feedback-and-authored-assemblies): connector-aware placement, precise free-form coordinates, explicit assembly modules and a compact neutral interface remain browser-local.

## BRK-DEC-005 npm and no global installations

Status: adopted by explicit subsequent user instruction. Use npm with independent owning-repository manifests and `package-lock.json`; install project-local dependencies only. No system-global package, global package-manager installation, root workspace or implicitly shared runtime is authorized. This current instruction supersedes the original brief's pnpm choice. The [frontend decision](../brikuma-frontend/docs/DECISIONS.md#fe-dec-006-npm-tooling-override) owns local setup consequences.

## BRK-DEC-006 Private project publication and solo-development policy

Status: adopted by explicit owner instruction on 2026-09-25. The owner authorized GitHub CLI creation of private repositories, pushes and branch protection, then clarified that `brikuma` must be the complete project's entry point. This authorization covers the private `brikuma/brikuma` root and its three independently versioned children; it does not authorize public visibility, history rewriting, deployments or backend implementation. Existing histories are preserved and registered using real remote URLs and exact gitlinks. [Repository ownership and clone workflow](REPOSITORIES.md) is canonical.

The owner works alone and selected mandatory pull requests and CI without a second reviewer's approval. Configure `main` accordingly when GitHub permits enforcement; zero required external approvals does not remove the local candidate-review gate. GitHub returned HTTP 403 for private branch protection under the current plan. The repositories remain private, and neither workflow files nor repository merge preferences are evidence that protection is active. The [quality policy](QUALITY_GATES.md#private-github-repositories-and-main-protection) owns the requested rules, actual blocker and CI access model.

## BRK-DEC-007 Public preparation, privacy and solo merge authority

Status: adopted by owner plan on 2026-10-29; publication itself remains subject to final authorization. Remain on GitHub Free, use MIT for original material, preserve independent histories and third-party terms, and remove conversation URLs from all publishable historical versions. Remap affected root gitlinks and retain SHA maps. The owner approved mandatory 2FA; secure-method-only enforcement is deferred by the later clarification.

The owner may document self-review and merge their own PR with zero mandatory external approvals. Only the non-secret `maintainers` team receives PR-only update authority; a separate non-bypassable ruleset requires owning checks and `privacy`. Add documentation gates in the deferred children. The [publication policy](PUBLICATION.md) owns the exact sequence, coverage limits and acceptance probes; expected settings are versioned per repository. Configuration files alone are not evidence of remote enforcement.

## BRK-DEC-008 Defer known timeouts during initial publication preparation

Status: owner-directed on 2026-10-29. Continue finalizing the public-ready repositories while the known frontend component timeouts remain tracked for later work. The [one-time preparation decision](PUBLICATION.md#one-time-publication-preparation-decision) defines the exact-candidate exception, honest failure evidence and retained privacy/security checks. Required CI and future protected-branch rules are unchanged. This is not a passing frontend gate or an authorization to change public visibility.
