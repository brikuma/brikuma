# BRIKUMA

A frontend proof of concept for a brick-model creative workbench. The active application is [brikuma-frontend](brikuma-frontend/README.md). It explores free-form construction, curated models, bounded local edits, parts and instruction previews. It has no product backend.

Start with the [global documentation](docs/README.md), [repository status](docs/REPOSITORIES.md) and [frontend documentation](brikuma-frontend/docs/README.md). [Backend](brikuma-backend/README.md) and [infrastructure](brikuma-infrastructure/README.md) are documentation-only boundaries.

This [brikuma repository](https://github.com/brikuma/brikuma) is the project entry point. It owns shared documentation and pins the independently versioned frontend, backend and infrastructure as Git submodules. Clone the complete project with:

```sh
git clone --recurse-submodules https://github.com/brikuma/brikuma.git
```

The public repositories can be cloned without credentials. Run application commands inside `brikuma-frontend`; do not scaffold an application or install frontend dependencies at this root. See the [repository workflow](docs/REPOSITORIES.md) for child changes and integration pins.

Changes to `main` require a pull request, current privacy and quality checks, and resolved conversations. Only designated maintainers may merge; zero external approvals are required for solo work. The [quality policy](docs/QUALITY_GATES.md#private-github-repositories-and-main-protection) explains the separate integrity and merge-authority rulesets.

The frontend workflow delivers its verified static build as a downloadable GitHub Actions artifact. Select a successful run matching this root's frontend pin; see [verified build downloads](brikuma-frontend/README.md#verified-build-downloads). Hosting remains deferred.

See [contributing](CONTRIBUTING.md), [changes](CHANGELOG.md), [security](SECURITY.md), [agent instructions](AGENTS.md), [Claude adapter](CLAUDE.md) and [vocabulary](LEGEND.md). BRIKUMA is independent and is not affiliated with or certified by LEGO.

Original project material is licensed under [MIT](LICENSE); third-party material retains its own terms. See [privacy setup](PRIVACY.md) and [security reporting](SECURITY.md). The [publication policy](docs/PUBLICATION.md) records the approved public transition, security controls and verification limits.
