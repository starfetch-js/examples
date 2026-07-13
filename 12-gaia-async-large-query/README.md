# Gaia Async Job Lifecycle

[Open this example in StackBlitz](https://stackblitz.com/github/starfetch-js/examples?file=12-gaia-async-large-query%2FREADME.md)

Submit, inspect, wait for, fetch, and clean up a Gaia TAP async job. Async TAP is
useful when a query may take longer than a simple `/sync` request or when a
service expects longer work to use UWS jobs.

Service: ESA Gaia Archive TAP preset, `gaia`.
Table: `gaiadr3.gaia_source`.

Run:

```sh
node 12-gaia-async-large-query/run.mjs
```

The workflow writes `out/result.xml` and deletes the remote job at the end.
Starfetch exposes explicit polling through `tap jobs wait`; it does not run a
background scheduler or hidden polling daemon.
