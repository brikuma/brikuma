# Agent review policy

ID: BRK-AI-001

Owner/scope: Integration root

Status: Specified

Baseline: frontend execution brief 1.1.0 / consolidated product v0.0.3, 2026-09-24.

Before each agent-authored commit, review the exact staged candidate read-only against applicable specs, actual package APIs and actual check outputs. Prefer a separate read-only reviewer when available; otherwise label structured self-review. Do not call self-review independent.

Check requirement ownership, API existence, inward dependencies, core rule ownership, behavioral/keyboard failure coverage, count/revision consistency, asset/source evidence, checker changes, English/atomic scope and remaining risk. Findings require file/line, severity, concrete evidence and resolution; speculative concerns remain questions. Critical/high unresolved findings block the commit. A waived lower risk needs rationale and owner acceptance.

The candidate review record includes repository identity, base commit or initial state, candidate tree, lock/toolchain inputs, timestamp, actual commands/exit codes and artifact references. Keep raw evidence ignored so it cannot alter its own candidate. If code, index or relevant inputs change, re-run and re-review. The helper checks record consistency, not correctness or reviewer identity.

CI reruns deterministic checks without trusting local evidence. No external model runs in hooks. No no-op hallucination checker, hidden reasoning transcript, credentials or user data belongs in evidence. Parent/child tool instruction loading is reported explicitly, not inferred from file existence.

Related: [quality gates](../QUALITY_GATES.md), [frontend review protocol](../../brikuma-frontend/docs/ai/REVIEW.md). Source: execution brief §18.5.
