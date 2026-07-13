# VizieR Filtered Catalog Query

[Open this example in StackBlitz](https://stackblitz.com/github/starfetch-js/examples?file=07-vizier-filtered-catalog-query%2FREADME.md)

Query VizieR Gaia DR3 rows with simple parallax, magnitude, color, and proper
motion filters.

Service: VizieR TAP preset, `vizier`.
Table: `"I/355/gaiadr3"`.

Run:

```sh
node 07-vizier-filtered-catalog-query/run.mjs
```

The workflow writes `out/vizier-filtered.jsonl`.
