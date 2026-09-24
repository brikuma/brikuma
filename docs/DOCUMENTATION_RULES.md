# Documentation ownership and links

ID: BRK-DOC-002

Owner/scope: Integration root

Status: Specified

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

Every rule has one canonical owner. Root pages own product/repository policy; frontend pages own implementation, screens, tool contracts and tests. Child pages link shared policy rather than duplicating it. Cross-project decisions are indexed here and linked from local decisions.

Each specification gives an ID, owner/scope, status, baseline, related documents and actual sources. Requirement IDs `FE-001` through `FE-024` remain distinct from document IDs. Do not invent IDs for unavailable original Word documents.

All authored documentation is English. Preserve originals and third-party notices; summarize unavailable/non-English references honestly. Distinguish specified, implemented, passed, failed, blocked, not run and not measured using the [legend](../LEGEND.md).

Every wiki page is reachable from its owning index. Internal file/anchor/import checks are offline and must include linked code/tests. Cross-repository links need a deliberate conditional-link manifest; `../` must not be blanket-ignored. Full integration resolves the pinned candidate child trees. External URL rechecks are a separate explicit action and cannot prove a claim merely by returning HTTP 200.

Keep `AGENTS.md` concise, task-oriented and linked. Preserve generated framework blocks. Root `CLAUDE.md` imports `@AGENTS.md`; child adapters import `@../AGENTS.md` then `@AGENTS.md`. Check actual tool-loaded paths and allowed directory access. In this session the prior frontend entry was read explicitly; root policy was newly authored. Claude import syntax was checked against official docs, but no installed Claude Code execution has yet verified import loading. No global agent setting is changed.

Sources: execution brief §6; [Claude memory/imports](https://code.claude.com/docs/en/memory), accessed 2026-09-24. Related: [review policy](ai/REVIEW_POLICY.md), [frontend index](../brikuma-frontend/docs/README.md).

The implemented root checker and exact conditional-link manifest are documented under [root quality tooling](QUALITY_GATES.md#implemented-offline-root-documentation-guard). Unknown or stale targets fail; a missing explicitly conditional child checkout is reported unavailable only in the deliberate root-candidate bootstrap mode. Full pinned integration remains a separate required check.
