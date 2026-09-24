# Global source register

ID: BRK-SRC-001

Owner/scope: Integration root

Status: Specified

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

Access/reference date: 2026-09-24. Technical links are starting points, not a blanket dependency audit. Version-specific package evidence belongs to [frontend dependencies](../brikuma-frontend/docs/engineering/DEPENDENCIES.md).

| Source                                                                              | State                                                                           | Supported use                                                                                  |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| User execution prompt 1.1.0                                                         | Supplied and read                                                               | Product/frontend acceptance and repository policy; consolidated v0.0.3 baseline.               |
| Original three v0.0.3 Word files                                                    | Unavailable; unreviewed                                                         | No original IDs or line-level verification asserted.                                           |
| `references/forma-editor-reference.png`                                             | Absent at inspection                                                            | Recoverable verbal design direction only.                                                      |
| Shared ChatGPT page (private reference URL withheld)     | Fetch unsuccessful; unreviewed                                                  | No additional authority extracted.                                                             |
| [Git submodules](https://git-scm.com/docs/gitsubmodules)                            | Read official documentation                                                     | Independent histories, gitlinks and registered metadata.                                       |
| [Git submodule command](https://git-scm.com/docs/git-submodule)                     | Read official documentation                                                     | Exact-pinned initialization and update behavior.                                               |
| [Claude Code memory](https://code.claude.com/docs/en/memory)                        | Read official documentation                                                     | Relative `@` imports and external import access behavior; installed CLI execution not checked. |
| [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)        | Read official specification                                                     | Commit syntax; English and atomicity are project policy.                                       |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                           | Opened official recommendation                                                  | Accessibility target; no conformance certification asserted.                                   |
| [Codex instruction discovery](https://developers.openai.com/codex/guides/agents-md) | Supplied starting reference; not separately verified by this documentation pass | Scope-sensitive governance must be verified against the actual agent context.                  |

Related: [product context](PROJECT_CONTEXT.md), [frontend sources](../brikuma-frontend/docs/SOURCES.md).
