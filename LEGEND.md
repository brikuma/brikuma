# Shared vocabulary

Owner: integration root. Status: specified. Baseline: consolidated v0.0.3.

| Term                  | Meaning                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Frontend preview      | Static application with browser-local interaction and fictional display fixtures.                 |
| Specified             | Required behavior is documented; execution evidence is still needed.                              |
| Implemented           | Code or documents exist; this alone does not imply tests passed.                                  |
| Tested / passed       | Named command or manual check succeeded in a recorded environment.                                |
| Failed                | A performed check found a defect.                                                                 |
| Blocked               | A required prerequisite is unavailable.                                                           |
| Not checked / not run | No verification was performed.                                                                    |
| Not measured          | No valid quantitative measurement exists.                                                         |
| Superproject          | Integration repository owning global policy and selected child commits.                           |
| Gitlink               | A mode `160000` tree entry pointing at a child commit, paired with registered submodule metadata. |
| Baseline revision     | Original curated model revision to which example instructions/reports are anchored.               |
| Local revision        | In-memory edit state; neither cloud save nor engineering certification.                           |
| Construction system   | Structural approach, distinct from visual style or color.                                         |

See [frontend vocabulary](brikuma-frontend/LEGEND.md) and [global index](docs/README.md).
