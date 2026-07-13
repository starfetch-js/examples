# Starfetch Examples Agent Guide

This repository contains runnable, cross-platform examples for Starfetch
packages. Keep examples focused on durable user workflows and public Starfetch
interfaces.

## Reliability rules

- Inspect TAP service, table, and column metadata before adding a
  service-specific query.
- Bound every public-service query with `TOP`, a small spatial region, or an
  equivalent service-supported constraint.
- Keep the exact ADQL beside the runner and report service errors as errors,
  not empty scientific results.
- Use cross-platform Node.js runners.
- Write generated data only beneath ignored `out/` directories.
- Do not add a fixture TAP server. CI checks package integration offline. Run
  live examples manually against public TAP services.

## Dependencies

Use exact registry versions for all direct dependencies and commit the
lockfile. Update the four `@starfetch-js/*` packages together and verify the
result with the typecheck and smoke test.

## MCP Inspector

Keep `mcp/inspector.json` aligned with the installed `@starfetch-js/mcp`
package. Do not disable Inspector authentication or expose its local proxy
beyond localhost.

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
