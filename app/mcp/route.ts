import { createMcpHandler } from "mcp-handler";
import { NextResponse } from "next/server";
import { z } from "zod";

// Tool definitions for reuse in GET response
const tools = [
  {
    name: "echo",
    description: "Echo back a message to verify input/output communication",
    parameters: { message: "string" },
  },
  {
    name: "get_server_time",
    description: "Returns the current server time and timezone information",
    parameters: {},
  },
];

// StreamableHttp server
const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "echo",
      "Echo back a message to verify input/output communication",
      {
        message: z.string(),
      },
      async ({ message }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      })
    );

    server.tool(
      "get_server_time",
      "Returns the current server time and timezone information",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                serverTime: new Date().toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timestamp: Date.now(),
              },
              null,
              2
            ),
          },
        ],
      })
    );
  },
  {
    capabilities: {
      tools: {},
    },
  },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  }
);

// GET handler — returns server info for browsers/discovery
export async function GET() {
  return NextResponse.json(
    {
      name: "MCP Server Template",
      version: "0.1.0",
      protocol: "Model Context Protocol (MCP)",
      transport: "Streamable HTTP",
      status: "running",
      tools,
      usage: {
        note: "This endpoint uses POST for MCP communication",
        test: "npx tsx scripts/test-streamable-http-client.ts <origin>",
        docs: "https://modelcontextprotocol.io",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export { handler as POST, handler as DELETE };
