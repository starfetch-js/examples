# Starfetch Examples Agent Guide

This repository contains runnable, cross-platform examples for released
Starfetch packages. Keep examples focused on durable user workflows rather
than internal Starfetch implementation details.

## Reliability rules

- Inspect TAP service, table, and column metadata before adding a
  service-specific query.
- Bound every public-service query with `TOP`, a small spatial region, or an
  equivalent service-supported constraint.
- Keep the exact ADQL beside the runner and report service errors as errors,
  not empty scientific results.
- Use Node.js runners rather than platform-specific shell scripts.
- Write generated data only beneath ignored `out/` directories.
- Do not add a fixture TAP server. CI checks package integration offline;
  live examples intentionally exercise real public TAP services when run
  manually.

## Dependencies

Direct dependencies are exact-pinned. During local staging, Starfetch packages
may use sibling `file:` dependencies. Before publishing changes, replace those
entries with the exact latest versions verified by the canary workflow and
commit the resulting lockfile.

## MCP Inspector

The Inspector flow is a manual product demonstration, not a duplicate test
harness. Keep `mcp/inspector.json` aligned with the installed
`@starfetch-js/mcp` package. Do not disable Inspector authentication or expose
its local proxy beyond localhost.

## Verification

Run before finishing:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run smoke
```

Run `npm run examples:live` when query or runner behavior changes and public
network access is available. Live TAP calls do not belong in default CI.
