# Security and distribution

The POC must make no runtime requests to external services. Only static same-origin documents/assets and session-local image object URLs are expected. No secrets, real personal profiles, private designs or protected marketplace files belong in fixtures.

A static bundle is public to its recipient. Hidden controls and read-only badges provide no access control. Original project material uses the [MIT license](LICENSE), with third-party terms preserved. No public deployment is approved. Use [GitHub Private Vulnerability Reporting](https://github.com/brikuma/brikuma/security/advisories/new) once enabled at publication; until then this channel is unavailable. Never post private findings in a public issue or invent a personal contact address.

Dependency audits concern known advisories and do not prove correctness. Unresolved relevant high/critical findings block delivery; any risk exception requires the owner. See [quality policy](docs/QUALITY_GATES.md) and [frontend security](brikuma-frontend/SECURITY.md).

Follow [privacy setup](PRIVACY.md) and the [publication policy](docs/PUBLICATION.md). An exposed credential must be revoked or rotated before history cleanup; old PR refs and cached views require separate verification.
