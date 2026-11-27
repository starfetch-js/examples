import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { parseVotable } from "@starfetch-js/core";

const service = "https://gaia.aip.de/tap";
const publication = "https://doi.org/10.1051/0004-6361/201935533";
const catalog =
  "https://vizier.cfa.harvard.edu/viz-bin/votable?-source=J%2FA%2BA%2F628%2FA66%2Fpleiades&-out=Source%2CRV&-out.max=2282";
const dir = fileURLToPath(new URL(".", import.meta.url));
const sourceQuery = await readFile(join(dir, "members.sql"), "utf8");
const destinationQuery = await readFile(join(dir, "counterparts.sql"), "utf8");
const expected = JSON.parse(
  await readFile(join(dir, "expected-columns.json"), "utf8"),
);
const client = new Client({ name: "pleiades-radial-velocities", version: "1" });
const server =
  process.env.STARFETCH_MCP_ENTRY ??
  fileURLToPath(import.meta.resolve("@starfetch-js/mcp"));
let jobUrl;

async function call(name, args) {
  const result = await client.callTool({ name, arguments: args }, undefined, {
    timeout: 180000,
  });
  if (result.isError) throw new Error(result.content[0].text);
  return result.structuredContent.data;
}

function table(xml) {
  const data = parseVotable(xml);
  assert.equal(
    data.queryStatus?.value?.toUpperCase(),
    "OK",
    "Expected a complete TAP result",
  );
  return data;
}

try {
  await client.connect(
    new StdioClientTransport({ command: process.execPath, args: [server] }),
  );
  assert.equal(
    (await call("starfetch_tap_availability", { url: service })).available,
    true,
  );
  const tables = await call("starfetch_tap_tables", { url: service });
  for (const [name, needed] of [
    ["gaiadr2.gaia_source", ["source_id", "radial_velocity"]],
    [
      "gaiadr3.gaia_source",
      ["source_id", "radial_velocity", "radial_velocity_error"],
    ],
    [
      "gaiadr3.dr2_neighbourhood",
      ["dr2_source_id", "dr3_source_id", "angular_distance"],
    ],
  ]) {
    assert(
      tables.some((t) => t.name === name),
      name,
    );
    const columns = await call("starfetch_tap_columns", {
      url: service,
      table: name,
    });
    for (const column of needed)
      assert(
        columns.some((c) => c.name === column),
        name + "." + column,
      );
  }

  const sourceLimit = 2282;
  const destinationLimit = 10000;
  const submitted = await call("starfetch_tap_submit_job", {
    url: service,
    query: sourceQuery,
    requestFormat: "votable",
    maxrec: sourceLimit,
    uploads: [{ tableName: "members", uri: catalog }],
  });
  jobUrl = submitted.url;
  const status = await call("starfetch_tap_job_wait", {
    jobIdOrUrl: jobUrl,
    timeoutMs: 120000,
  });
  assert.equal(status.phase, "COMPLETED");

  const tools = await client.listTools();
  const queryTool = tools.tools.find(
    (tool) => tool.name === "starfetch_tap_query",
  );
  const nativeTransfer = Object.hasOwn(
    queryTool.inputSchema.properties,
    "uploadFromJob",
  );
  let transfer;
  if (nativeTransfer) {
    transfer = { uploadFromJob: { jobUrl, tableName: "targets" } };
  } else {
    const source = await call("starfetch_tap_job_fetch", {
      jobIdOrUrl: jobUrl,
      format: "votable",
    });
    assert.equal(table(source.content).rows.length, 2281);
    transfer = { uploads: [{ tableName: "targets", votable: source.content }] };
  }
  const result = await call("starfetch_tap_query", {
    url: service,
    query: destinationQuery,
    format: "votable",
    maxrec: destinationLimit,
    ...transfer,
  });
  const { fields, rows } = table(result.content);
  assert.deepEqual(
    fields.map((f) => f.name),
    expected,
  );
  const byTarget = new Map();
  for (const row of rows) {
    assert.match(row.dr2_id, /^\d+$/);
    assert.equal(row.dr2_id, row.matched_dr2_id, "Missing DR2 catalog entry");
    assert.equal(
      row.dr3_id,
      row.matched_dr3_id,
      "Unresolved DR3 catalog entry",
    );
    if (!byTarget.has(row.dr2_id)) byTarget.set(row.dr2_id, []);
    byTarget.get(row.dr2_id).push(row);
  }
  assert.equal(byTarget.size, 2281, "Incomplete published target list");
  const counts = {
    unmatched: 0,
    ambiguous: 0,
    newly_measured: 0,
    retained: 0,
    still_missing: 0,
    lost: 0,
  };
  let dr2Measured = 0;
  let depositedNonzero = 0;
  let coverageDisagreements = 0;
  const shortlist = ["dr2_id,dr3_id,rv_dr3_kms,rv_dr3_error_kms"];
  for (const candidates of byTarget.values()) {
    const first = candidates[0];
    const hadRV = first.rv_dr2_kms !== null;
    const nonzero =
      first.deposited_rv !== null && Number(first.deposited_rv) !== 0;
    if (hadRV) dr2Measured++;
    if (nonzero) depositedNonzero++;
    if (hadRV !== nonzero) coverageDisagreements++;
    let status;
    if (first.dr3_id === null) status = "unmatched";
    else if (candidates.length > 1 || first.competing_dr2_id !== null)
      status = "ambiguous";
    else if (first.rv_dr3_kms !== null)
      status = hadRV ? "retained" : "newly_measured";
    else status = hadRV ? "lost" : "still_missing";
    for (const row of candidates) row.status = status;
    counts[status]++;
    if (status === "newly_measured")
      shortlist.push(
        [
          first.dr2_id,
          first.dr3_id,
          first.rv_dr3_kms,
          first.rv_dr3_error_kms,
        ].join(","),
      );
  }
  const summary = {
    publication,
    catalog,
    service,
    retrievedAt: new Date().toISOString(),
    toolVersion: client.getServerVersion().version,
    transfer: nativeTransfer ? "uploadFromJob" : "inline VOTable",
    sourceQuery,
    sourceLimit,
    destinationQuery,
    destinationLimit,
    members: byTarget.size,
    reportedDr2Measured: 342,
    archiveDr2Measured: dr2Measured,
    depositedNonzero,
    coverageDisagreements,
    archivedMinusReported: dr2Measured - 342,
    neighbourRows: rows.length,
    counts,
  };
  const out = join(dir, "out");
  await mkdir(out, { recursive: true });
  const run = await mkdtemp(join(out, "run-"));
  await Promise.all([
    writeFile(
      join(run, "counterparts.jsonl"),
      rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    ),
    writeFile(join(run, "newly-measured.csv"), shortlist.join("\n") + "\n"),
    writeFile(
      join(run, "summary.json"),
      JSON.stringify(summary, null, 2) + "\n",
    ),
  ]);
  console.log(JSON.stringify(summary, null, 2), run);
} finally {
  try {
    if (jobUrl) await call("starfetch_tap_job_delete", { jobIdOrUrl: jobUrl });
  } finally {
    await client.close();
  }
}
