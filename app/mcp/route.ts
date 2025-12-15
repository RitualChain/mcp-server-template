import { createMcpHandler } from "mcp-handler"
import { z } from "zod"

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
      }),
    )

    server.tool("get_server_time", "Returns the current server time and timezone information", {}, async () => ({
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
            2,
          ),
        },
      ],
    }))
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
    },
  },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  },
)

export { handler as GET, handler as POST, handler as DELETE }
