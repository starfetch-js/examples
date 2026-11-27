# Which Pleiades candidates gained a Gaia radial velocity?

Start with the 2,281 candidates in the Lodieu et al. (2019) Pleiades table. Follow their DR2 identifiers into DR3 and export the candidates that gained a published Gaia radial velocity (RV) and have a unique counterpart in both directions. These stars may also have velocities from other surveys. [Paper, §4.2](https://doi.org/10.1051/0004-6361/201935533) · [Published table and column definitions](https://vizier.cfa.harvard.edu/viz-bin/VizieR-3?-source=J%2FA%2BA%2F628%2FA66%2Fpleiades)

## Run

From the repository root after `npm ci`:

```sh
node 13-pleiades-radial-velocities/run.mjs
```

The local Starfetch MCP server submits `members.sql` to Gaia@AIP with the Harvard VizieR export as a TAP upload. The export contains the published `Source` and `RV` columns. The query joins on the DR2 source identifier and fetches Gaia's DR2 velocity independently.

After the job completes, the runner passes its VOTable to `counterparts.sql`. It uses `uploadFromJob` when the server advertises it. With older servers that do not advertise this feature, the runner fetches and forwards the VOTable through the existing MCP upload tools. Set `STARFETCH_MCP_ENTRY` to the absolute path of a built Starfetch MCP entry point to select that server. Both paths require the public services to be available.

Each successful run prints its output directory under `out/`:

- `newly-measured.csv` contains both Gaia IDs, the DR3 velocity, and its uncertainty in km/s. Import both ID columns as strings to preserve all digits.
- `counterparts.jsonl` retains every candidate, its status, and every neighbourhood row, including competing IDs and separation in milliarcseconds. IDs are strings; missing velocities are null.
- `summary.json` records the selection, source URL, service, both exact queries and row limits, transfer method, retrieval time, and counts.

## Reference run, 27 November 2026

All 2,281 deposited identifiers were distinct and matched a DR2 source. The paper reports **342** candidates with a Gaia DR2 radial velocity. Gaia@AIP has **301** non-null DR2 velocities for these IDs. The same 301 rows have nonzero values in the deposited `RV` column. The cause of the 41-star discrepancy remains unresolved. The classifications below use Gaia's measured field; zero velocity counts as a measurement whenever Gaia publishes it.

| Status per original candidate       | Count |
| ----------------------------------- | ----: |
| Gained a DR3 velocity               |   334 |
| Had velocities in both releases     |   285 |
| Missing a velocity in both releases | 1,558 |
| Had a DR2 velocity only             |    10 |
| Ambiguous counterpart               |    94 |
| No DR3 neighbour                    |     0 |

A match is ambiguous if one DR2 ID has multiple DR3 neighbours or if another DR2 ID, even outside this sample, shares its DR3 neighbour. An ambiguous candidate is counted once and excluded from all four velocity comparisons. A unique neighbourhood association is a catalog criterion for selection; individual identifications can still require inspection. [Gaia cross-release table](https://gaia.aip.de/metadata/gaiadr3/dr2_neighbourhood/)
