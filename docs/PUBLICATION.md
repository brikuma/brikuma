# Publication and privacy policy

ID: BRK-PUB-001

Owner/scope: Integration root; all four independent repositories

Status: Public transition authorized by the owner on 2026-10-30; enforcement requires API readback and acceptance probes

Baseline: owner publication plan and subsequent clarifications, 2026-10-29.

## Approved outcome

Remain on GitHub Free. Keep the root and three child histories independent, with exact submodule pins and remotes in the `brikuma` organization. Original BRIKUMA material uses the [MIT license](../LICENSE); retain upstream copyrights, licenses and notices for copied material and dependencies. This authorizes neither a deployment nor backend implementation.

The owner and explicitly appointed members of the non-secret `maintainers` team may merge through pull requests. Delegates receive `write`, not administrative access. The owner may review and merge their own PR after documented exact-candidate review and successful required checks. Zero external approvals are required; self-review must never be described as independent approval. [CODEOWNERS](../.github/CODEOWNERS) assigns review ownership and grants no permission by itself.

### One-time publication preparation decision

On 2026-10-29 the owner explicitly deferred the known frontend component-test timeouts and directed publication preparation to proceed first. This decision permits finalizing the initial privacy/governance commits and their root integration while those failures remain open in frontend issues #1–#6 (formerly #5–#10 before repository replacement). The retained local full-suite run recorded 792 passes and six timeout failures across five files; it is not a passing gate and is not relabeled as one. Later CI passed its deterministic checks and then encountered the separately tracked browser timeout.

For this bootstrap only, record the exact candidate, the owner's exception, separate read-only review, the retained failed-run evidence and fresh applicable privacy, dependency-security, staged-hygiene, type, architecture and documentation checks. Keep privacy and commit-message validation active. A temporary local hook used to commit this reviewed candidate must bind to its exact tree and the recorded checks; it must not create a reusable bypass or be shipped as a project hook. Root checks and strict pinned documentation integration remain mandatory.

This exception does not skip tests in CI, change assertions, increase timeouts, mark failures resolved, waive a privacy/security finding, or authorize bypassing future protected-branch rules. Private preparation includes explicit audited history updates with expected-old-SHA leases; public visibility still requires the final authorization below. Retain old local branches privately, switch working copies to a dedicated prepared branch, and never publish preserved old/audit refs.

## Privacy controls and trust

Use the GitHub `noreply` address assigned to the contributor in repository-local Git configuration. Do not change global Git identity. New author, committer, tagger and attribution-trailer identities must use `noreply`; GitHub's web commit address is the narrow service exception. Public upstream attribution may be approved only for an exact immutable blob and category in `privacy-policy.json`, with a documented reason. Never exempt a directory, new contributor or secret finding wholesale. `.mailmap` changes display, not the original objects.

Each repository owns a standalone standard-library Python scanner, a Gitleaks version/checksum lock, tests and hooks. See [local setup](../PRIVACY.md). The scanner reads raw Git objects without replacement objects or mailmap rendering. It inspects every introduced commit, including intermediate versions later removed, commit headers/messages, annotated tags, ref names, filenames and blobs. PR scans include the integration result. Full scans include all locally available refs and may include unreachable objects. Gitlinks require scans in the owning children; a root scan alone cannot certify them.

The `privacy` workflow runs on `pull_request`, push, manual dispatch and weekly schedules. On PRs it uses scanner code, tool lock and policy from the exact base SHA. It checks out and reads candidate objects without executing candidate application code in that job. Token permissions are read-only; no repository secret is supplied to fork code. Actions are pinned to reviewed commit SHAs. Maintainers must inspect external changes before approving their workflow execution.

Workflow, scanner, exception policy, installer and dependency changes require an additional local scan/test/review of the exact candidate SHA before merge. A PR can edit its own workflow, so base-loaded scanner code is not an independent GitHub enforcement boundary. The initial policy bootstrap must be locally verified while private before subsequent PRs can use it as an approved base; a missing base scanner fails instead of silently trusting the PR.

Findings contain repository identifiers, object references, relative locations, categories, severity and resolution. Matched values, raw scanner diagnostics, private addresses and personal paths must not be copied into reports. Sensitive filenames are replaced with opaque location identifiers. Review logs use repository identifiers and relative locations. Keep raw temporary inputs private and remove them after deriving sanitized evidence.

Pattern checks do not establish complete privacy coverage. Review documents, conversation references, images and embedded metadata manually. Record archives, LFS payloads, attachments, unavailable GitHub surfaces and visual content as not verified until actually inspected. A green code scan cannot substitute for that evidence. Never claim an absolute guarantee about third-party forks or an owner's ability to change policy.

## Repository and organization configuration

Each owning [repository policy](../.github/repository-policy.json) contains the exact expected settings and two `main`/default-branch rulesets. `main-integrity` requires PRs, up-to-date checks, resolved conversations, linear history and no deletion or force push, with no bypass actors. `main-merge-authority` restricts updates; only the `maintainers` team can bypass that separate restriction, and only through PRs. Its bypass cannot bypass the integrity ruleset. Permit squash merge only, delete merged branches and keep auto-merge disabled.

Required contexts are `privacy` plus `root-required-gate` in root, `required` in frontend, and `docs-required-gate` in each documentation child. Bind these contexts to GitHub Actions. The documentation children add repository governance tooling only, not application runtimes.

The organizational base permission is `None`. Repository creation, transfer, deletion and visibility changes are owner-only. Require 2FA after the owner confirms recovery access. The later owner clarification defers the secure-method-only restriction while retaining mandatory 2FA. Require approval for OAuth applications and fine-grained tokens, with maximum token lifetimes of 90 days. Inventory integrations before restricting them; never remove a currently required deploy key before its replacement is verified.

Enable free public-repository secret scanning, push protection, dependency alerts/security updates and Private Vulnerability Reporting. The latter is the security contact channel; do not publish a personal email address. Before it is enabled, the reporting channel is unavailable and must be described that way.

`python3 -B scripts/github-policy.py render` prints expected configuration without changing GitHub. `audit` reads actual repository settings, rulesets and security features; missing access is a failure, not a match. Weekly repository audits run with read-only `GITHUB_TOKEN` and `--public-only`, reporting administrative settings as not checked instead of claiming full coverage. Owner-level `audit --organization` additionally checks Actions permissions, secret scanning and Dependabot alerts/security updates. Organization settings need an owner-authorized read; OAuth/PAT policies require separate UI verification because the CLI OAuth token cannot read all token-administration surfaces. Do not label repository-only scheduled coverage as a complete organization audit. Record the remaining organization scheduling limitation in publication evidence until an approved mechanism exists.

## Audit and history cleanup

Inventory available branches, tags, open/closed PR refs, forks, issues/comments/reviews, releases/assets, Actions logs/artifacts/caches, wiki and discussions. Inspect all historical versions, including deleted files; inventory LFS separately. Report the scope and unavailable or expired surfaces. Review public upstream attributions separately from personal contact data and synthetic fixtures.

Rotate/revoke a real exposed credential before removing its text. Rewrite only where findings require it, in isolated copies. Preserve dates, identities, topology and commits where possible. Save old-to-new SHA maps. Clean children first and remap every affected historical root gitlink. Signed rewritten commits lose their original signatures; do not claim they retain verification. Scan the cleaned reachable objects again and verify every remapped child commit exists.

An explicit force push does not remove old PR refs, cached commit views or other clones. Verify those surfaces separately and involve GitHub Support when needed. Keep repositories private while an unresolved exposure remains. Publish only approved explicit refs, never a mirror that exports internal audit or local refs. Preserve existing user checkouts and local references; provide cleaned candidates separately.

## Controlled publication and acceptance

GitHub Free provides repository rulesets for public repositories. Visibility and protection changes are not atomic. Prepare all payloads and evidence first; present the sanitized report, exact candidate SHAs, rewrite maps, blocked surfaces and expected settings for final owner authorization.

After authorization, inventory concurrent writes and publish and immediately protect one child at a time. Actions and automated security updates remain enabled; exact expected-SHA leases and a fresh complete ref inventory guard against concurrent changes. Read back both rulesets before proceeding. If protection fails, stop subsequent publications and resolve the failed protection before proceeding. Integrate the root's exact public child commits and verify its secret-free CI. Only then remove the three obsolete child deploy keys and root read-key secrets. Publish and protect root last.

Test an anonymous recursive clone and a fork PR without secrets. On disposable test branches with equivalent rules, verify that a green owner PR is allowed; missing/failed `privacy`, direct pushes, force pushes and deletion are blocked. Verify maintainer merge authority without risking `main`. Read effective settings through APIs. Record real outcomes, not merely the existence of configuration files. Do not create or delete remote test data before the publication authorization covers those probes.

Remove task-created clones, downloads, caches, logs and build outputs once the needed sanitized deliverables have been retained. Do not remove existing user files, dependencies or references. Retain only reviewable candidate bundles/patches, SHA maps and sanitized evidence needed to resume the approved process.

Sources checked 2026-10-29: [ruleset availability and layering](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [PR-only bypass](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), [sensitive data removal](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), [PAT policy](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization), [token administration API limits](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/managing-requests-for-personal-access-tokens-in-your-organization).

Related: [quality gates](QUALITY_GATES.md), [repository ownership](REPOSITORIES.md), [decision index](DECISIONS.md), [security](../SECURITY.md).

## Retained external skills

The owner chose to retain frontend `.agents/`, `.claude/` and `skills-lock.json` while documenting their unverified redistribution license. The frontend [third-party notices](../brikuma-frontend/THIRD_PARTY_NOTICES.md#external-agent-skills-redistribution-license-unverified) distinguish these copies from original MIT material. A clean privacy scan does not resolve this licensing limitation.

## Authorized public transition and repository replacement

On 2026-10-30 the owner authorized publication, declined GitHub Support, and authorized deleting the original frontend and root GitHub repositories after independent clean replacements were prepared. A force push had replaced branch tips but left old PR references and cached commit views accessible. The replacements preserve cleaned Git history and exact child pins, without a fork relationship or old PR refs. Transfer the seven reviewed timeout issues while both frontend repositories are private, preserve comments and labels, and update their issue numbers. The original local histories remain private; do not push those preserved refs back to the replacements.

The one-time bootstrap finalization also covers the reviewed issue-link, documentation and security-audit corrections before public protections are active. Bind any temporary local exception to the exact candidate tree, unchanged application/dependency inputs, passing applicable checks, independent read-only review and retained failed-run evidence. The separately observed browser timeout is frontend issue #7. No application failure is waived for a future protected PR, and no failed CI run is relabeled as successful.

The organization restricts external Actions to GitHub-owned actions, requires full commit SHAs, and defaults workflow tokens to read-only without PR-approval permission. Members cannot create repositories, teams or Pages sites, change repository visibility, delete repositories or fork private repositories. The enforced `BRIKUMA public repository security` configuration is the default for new public repositories and covers dependency graph, Dependabot alerts/security updates, CodeQL default setup, secret scanning, push protection and private vulnerability reporting. Apply it only to public repositories under the approved Free plan; no paid private security product is authorized.

The expected configuration and administrative audit include these organization controls. Repository-token weekly audits retain their explicitly narrower coverage. Restricting outside-collaborator invitations to organization owners requires GitHub Enterprise Cloud and is unavailable on the selected Free plan. Only repository admins can invite outside collaborators; delegated maintainers receive write, not admin. OAuth/PAT administration and other unavailable UI-only settings require separate effective-state verification. Mandatory secure-only 2FA remains deferred at the owner's direction; ordinary 2FA is required. Do not claim that all GitHub security features are enabled merely because the checked subset passes.

Source for the Free-plan invitation limit: [GitHub outside collaborators](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-outside-collaborators/adding-outside-collaborators-to-repositories-in-your-organization), checked 2026-10-30.
