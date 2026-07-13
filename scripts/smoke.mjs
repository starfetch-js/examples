import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const cliPath = fileURLToPath(import.meta.resolve("@starfetch-js/cli"));
const cli = spawnSync(process.execPath, [cliPath, "--help"], {
  encoding: "utf8",
});

assert.equal(cli.status, 0, cli.stderr);
assert.match(cli.stdout, /Usage:/);

const mcpPath = fileURLToPath(import.meta.resolve("@starfetch-js/mcp"));
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [mcpPath],
});
const client = new Client({
  name: "starfetch-examples-smoke",
  version: "0.0.0",
});

try {
  await client.connect(transport);

  const [{ tools }, { prompts }, { resources }] = await Promise.all([
    client.listTools(),
    client.listPrompts(),
    client.listResources(),
  ]);

  assert(tools.some(({ name }) => name === "starfetch_tap_query"));
  assert(prompts.some(({ name }) => name === "query_astronomy_catalog"));
  assert(resources.some(({ uri }) => uri === "starfetch://guides/adql"));
} finally {
  await client.close();
}

console.log("Verified installed Starfetch CLI and MCP surfaces.");
