import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.argv[2];
const verbose =
  process.argv.includes("--verbose") || process.argv.includes("-v");

if (!origin) {
  console.error(
    "Usage: npx tsx scripts/test-streamable-http-client.ts <origin> [--verbose|-v]"
  );
  console.error(
    "Example: npx tsx scripts/test-streamable-http-client.ts http://localhost:3000 -v"
  );
  process.exit(1);
}

const log = (label: string, data?: unknown) => {
  console.log(`\n\x1b[36m[${label}]\x1b[0m`);
  if (data !== undefined)
    console.log(
      typeof data === "object" ? JSON.stringify(data, null, 2) : data
    );
};

(async () => {
  const client = new Client({ name: "mcp-test-client", version: "1.0.0" });
  const url = new URL(`${origin}/mcp`);
  const transport = new StreamableHTTPClientTransport(url);

  try {
    const start = performance.now();
    log("Connecting", url.href);

    await client.connect(transport);
    log("Connected", {
      time: `${(performance.now() - start).toFixed(0)}ms`,
      capabilities: client.getServerCapabilities(),
    });

    const { tools } = await client.listTools();
    log(
      "Tools",
      tools.map((t) => ({ name: t.name, description: t.description }))
    );

    if (verbose && tools.length > 0) {
      log("Tool Schemas");
      for (const tool of tools) {
        console.log(`\n  \x1b[33m${tool.name}\x1b[0m`);
        console.log(
          `  ${JSON.stringify(tool.inputSchema, null, 2).replace(
            /\n/g,
            "\n  "
          )}`
        );
      }
    }

    const { prompts } = await client.listPrompts();
    if (prompts.length > 0) log("Prompts", prompts);

    const { resources } = await client.listResources();
    if (resources.length > 0) log("Resources", resources);

    log("Done", `Total: ${(performance.now() - start).toFixed(0)}ms`);
  } catch (err) {
    console.error(
      "\n\x1b[31m[Error]\x1b[0m",
      err instanceof Error ? err.message : err
    );
    if (verbose && err instanceof Error && err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.close();
  }
})();
