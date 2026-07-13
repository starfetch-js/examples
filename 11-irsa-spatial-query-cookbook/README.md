# IRSA Spatial Query Cookbook

[Open this example in StackBlitz](https://stackblitz.com/github/starfetch-js/examples?file=11-irsa-spatial-query-cookbook%2FREADME.md)

Run cone, box, and polygon ADQL spatial queries against the IRSA AllWISE source
catalog.

Service: IRSA TAP preset, `irsa`.
Table: `allwise_p3as_psd`.

Run:

```sh
node 11-irsa-spatial-query-cookbook/run.mjs
```

The workflow writes `out/cone.csv`, `out/box.csv`, and `out/polygon.csv`.
