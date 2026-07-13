# Starfetch Examples

Runnable examples for querying astronomy TAP services with Starfetch, plus an
MCP Inspector walkthrough for exploring Starfetch's tools, prompts, and
resources through a real MCP client.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/starfetch-js/examples)

The examples cover the current TAP/ADQL-first surfaces:

- service, table, and column discovery;
- bounded synchronous ADQL queries;
- explicit asynchronous TAP job lifecycle commands;
- VOTable, CSV, TSV, JSON, and JSONL output;
- Gaia, SIMBAD, VizieR, NASA Exoplanet Archive, and IRSA;
- the Starfetch CLI, TypeScript API, and MCP server.

## Setup

Node.js 22.13 or newer is required.

Install the exact Starfetch versions recorded in the lockfile:

```sh
npm ci
```

## Run an example

Every example has its exact ADQL in a `.sql` file, expected output columns, and
a cross-platform Node.js runner:

```sh
node 01-gaia-nearby-stars/run.mjs
```

Generated result files are written to the example's ignored `out/` directory.
Run all live examples with:

```sh
npm run examples:live
```

Live examples contact public TAP services. They are intentionally excluded
from default CI because remote availability, rate limits, and network
conditions are outside this repository's control.

## Explore the MCP server

Launch MCP Inspector against the installed Starfetch server:

```sh
npm run inspect:mcp
```

Follow [the Inspector walkthrough](mcp/README.md) to retrieve Starfetch
resources and prompts, inspect metadata, execute a bounded query, and examine
failure recovery. No local TAP fixture is involved: the demonstration is meant
to show the real MCP and public-service workflow.

## Examples

- `01-gaia-nearby-stars`: nearby Gaia DR3 sources.
- `02-gaia-high-proper-motion`: high proper-motion Gaia DR3 sources.
- `03-gaia-hr-diagram-table`: starter table for downstream HR diagrams.
- `04-simbad-field-object-types`: SIMBAD object types in a sky region.
- `05-simbad-identifiers-join`: SIMBAD `basic` to `ident` join.
- `06-vizier-catalog-field-query`: VizieR Gaia DR3 field query.
- `07-vizier-filtered-catalog-query`: bounded VizieR catalog query.
- `08-exoplanet-target-shortlist`: NASA Exoplanet Archive shortlist export.
- `09-exoplanet-transiting-hosts`: known transiting exoplanet hosts.
- `10-irsa-wise-region-query`: IRSA AllWISE cone query.
- `11-irsa-spatial-query-cookbook`: IRSA cone, box, and polygon queries.
- `12-gaia-async-large-query`: Gaia TAP async submit/status/wait/fetch/delete.

## Keeping Starfetch current

Released Starfetch dependencies are exact-pinned so examples remain
reproducible. Dependabot checks npm daily and groups `@starfetch-js/*` updates
into one compatibility change. The daily and manually runnable **Latest
Starfetch canary** workflow temporarily overlays all four Starfetch packages at
`latest`, without changing `package.json` or `package-lock.json`, then runs the
offline typecheck and smoke test.

This makes "latest" the newest version verified together and committed to the
lockfile, rather than a floating dependency that can silently break an example.

## Development checks

```sh
npm run format:check
npm run lint
npm run typecheck
npm run smoke
```

The smoke test starts the installed Starfetch MCP server over stdio and checks
that representative tools, prompts, and resources are discoverable. It does
not query a remote TAP service or duplicate MCP Inspector's UI behavior.

## License

MIT
