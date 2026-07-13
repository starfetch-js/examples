# Explore Starfetch with MCP Inspector

MCP Inspector provides a browser UI for manually exercising the installed
Starfetch MCP server through its real stdio entrypoint.

From this repository:

```sh
npm install
npm run inspect:mcp
```

Open the local URL printed by Inspector. The `starfetch` server is selected
from `mcp/inspector.json`.

Use the UI to inspect all three MCP surfaces:

1. In **Resources**, read `starfetch://guides/adql` and a service guide such as
   `starfetch://services/gaia`.
2. In **Prompts**, retrieve `explore_service` with `service: gaia`, then try
   `query_astronomy_catalog` with a bounded astronomy question.
3. In **Tools**, call the availability and metadata tools before submitting a
   small bounded query. Confirm the response preserves the selected service,
   table, exact ADQL, limit, and assumptions.
4. Deliberately try an invalid column, then verify the recovery path returns to
   table and column metadata instead of treating the failure as an empty
   result.

These calls use real TAP services and can fail because of remote availability
or rate limits. That is useful manual behavior to inspect; it is not suitable
for default CI. Keep Inspector on localhost and retain its authentication
defaults.
