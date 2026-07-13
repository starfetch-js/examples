# SIMBAD Identifiers Join

[Open this example in StackBlitz](https://stackblitz.com/github/starfetch-js/examples?file=05-simbad-identifiers-join%2FREADME.md)

Join SIMBAD object metadata to identifier rows, showing a real ADQL join over
SIMBAD TAP tables.

Service: SIMBAD TAP preset, `simbad`.
Tables: `basic`, `ident`.

Run:

```sh
node 05-simbad-identifiers-join/run.mjs
```

The workflow writes `out/identifiers.jsonl`.
