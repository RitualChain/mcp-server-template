# MCP Server Template

A production-ready template for building [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers using Next.js and the [`mcp-handler`](https://www.npmjs.com/package/mcp-handler) adapter.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RitualChain/mcp-server-template)

## Overview

This template provides a streamlined way to create MCP servers that can be consumed by AI agents like ChatGPT, Claude, Cursor, and other MCP-compatible clients. Deploy once, connect everywhere.

### Key Features

- 🚀 **One-click deployment** to Vercel
- 🔧 **Easy tool creation** using Zod schemas for type-safe inputs
- 🌐 **Streamable HTTP transport** for efficient real-time communication
- 📦 **Pre-configured** with TypeScript, Tailwind CSS, and Next.js 16
- 🎨 **Built-in landing page** with setup instructions

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCP Clients                              │
│  (ChatGPT, Claude, Cursor, Custom Agents)                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP (Streamable HTTP Transport)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Application                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     /mcp endpoint                         │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              mcp-handler adapter                    │  │  │
│  │  │  • Tool registration                                │  │  │
│  │  │  • Request/response handling                        │  │  │
│  │  │  • Schema validation (Zod)                          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                          │                                │  │
│  │           ┌──────────────┴──────────────┐                 │  │
│  │           ▼                             ▼                 │  │
│  │    ┌────────────┐               ┌────────────────┐        │  │
│  │    │   echo     │               │ get_server_time│        │  │
│  │    │   tool     │               │     tool       │        │  │
│  │    └────────────┘               └────────────────┘        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    / (Landing Page)                       │  │
│  │         Setup guide & MCP URL display                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
mcp-server-template/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page with setup instructions
│   └── mcp/
│       └── route.ts         # ⭐ MCP server endpoint (add tools here)
├── components/
│   ├── theme-provider.tsx   # Dark/light theme support
│   └── ui/                  # Reusable UI components (shadcn/ui)
├── scripts/
│   └── test-streamable-http-client.mjs  # Test client for local development
├── public/
│   └── images/              # Setup guide screenshots
├── package.json
└── README.md
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/RitualChain/mcp-server-template.git
cd mcp-server-template
bun install
```

### 2. Run Locally

```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

### 3. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RitualChain/mcp-server-template)

Or deploy manually:

```bash
npx vercel
```

---

## Adding Tools

Tools are defined in `app/mcp/route.ts`. The `createMcpHandler` function takes three arguments:

1. **Tool Registration Function** - Async function where you register tools using `server.tool()`
2. **Capabilities** - Server capabilities configuration
3. **Options** - Runtime options like `maxDuration` and `basePath`

### Tool Definition

Each tool requires four parameters:

| Parameter       | Type     | Description                                    |
| --------------- | -------- | ---------------------------------------------- |
| `name`          | string   | Unique identifier for the tool                 |
| `description`   | string   | What the tool does (shown to AI agents)        |
| `schema`        | object   | Zod schema defining input parameters           |
| `handler`       | function | Async function that executes the tool          |

### Current Implementation

Here's the complete `app/mcp/route.ts` structure:

```typescript
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  // 1. Tool Registration Function
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
  // 2. Capabilities
  {
    capabilities: {
      tools: {},
    },
  },
  // 3. Options
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
```

### Example: Adding a New Tool

To add a new tool, insert it in the tool registration function:

```typescript
server.tool(
  "get_pokemon",
  "Fetches Pokemon data from the PokeAPI",
  {
    name: z.string().describe("Name of the Pokemon"),
  },
  async ({ name }) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    const data = await response.json();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              name: data.name,
              types: data.types.map((t: { type: { name: string } }) => t.type.name),
              height: data.height,
              weight: data.weight,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);
```

### Zod Schema Patterns

Use Zod to define type-safe input schemas for your tools:

```typescript
import { z } from "zod";

// Required string
{ message: z.string() }

// String with description (shown to AI)
{ name: z.string().describe("The user's full name") }

// Optional parameter
{ limit: z.number().optional() }

// With default value
{ count: z.number().default(10) }

// Enum choices
{ format: z.enum(["json", "text", "markdown"]) }

// No parameters
{}
```

### Tool Response Format

Tools must return an object with a `content` array. Each content item has a `type` and corresponding data:

```typescript
// Text response
return {
  content: [{ type: "text", text: "Your response here" }],
};

// JSON response (stringify for readability)
return {
  content: [
    {
      type: "text",
      text: JSON.stringify({ key: "value" }, null, 2),
    },
  ],
};

// Multiple content items
return {
  content: [
    { type: "text", text: "First part" },
    { type: "text", text: "Second part" },
  ],
};
```

### Built-in Tools

| Tool              | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `echo`            | Echoes back a message (useful for testing connectivity) |
| `get_server_time` | Returns current server time and timezone                |

---

## Connecting MCP Clients

### ChatGPT

1. Go to **Settings** → **Apps & Connectors**
2. Click **Create** to add a new connector
3. Enter your MCP URL: `https://your-app.vercel.app/mcp`
4. Select "No authentication" and confirm

See the [landing page](/) for detailed step-by-step instructions with screenshots.

### Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "url": "https://your-app.vercel.app/mcp"
    }
  }
}
```

### Claude Desktop

Add to your Claude config file:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-app.vercel.app/mcp"]
    }
  }
}
```

---

## Testing

### Using the Test Client

```bash
node scripts/test-streamable-http-client.mjs https://your-app.vercel.app
```

This will connect to your MCP server and list available tools.

### Local Development

```bash
# Terminal 1: Start the dev server
bun run dev

# Terminal 2: Test the MCP endpoint
node scripts/test-streamable-http-client.mjs http://localhost:3000
```

---

## Configuration Reference

### Handler Options

The third argument to `createMcpHandler` configures runtime behavior:

```typescript
{
  basePath: "",        // Base path for MCP routes (empty = /mcp)
  verboseLogs: true,   // Enable detailed logging for debugging
  maxDuration: 60,     // Max execution time in seconds
  disableSse: true,    // Use Streamable HTTP instead of SSE
}
```

| Option        | Type    | Default | Description                                      |
| ------------- | ------- | ------- | ------------------------------------------------ |
| `basePath`    | string  | `""`    | Base path prefix for the MCP endpoint            |
| `verboseLogs` | boolean | `false` | Enable verbose logging for debugging             |
| `maxDuration` | number  | `60`    | Maximum function execution time (seconds)        |
| `disableSse`  | boolean | `false` | Use Streamable HTTP transport instead of SSE     |

### Vercel Configuration

For optimal performance on Vercel:

1. **Enable Fluid Compute** in your project settings for efficient execution
2. **Adjust `maxDuration`** based on your plan:

| Plan       | Max Duration |
| ---------- | ------------ |
| Hobby      | 60 seconds   |
| Pro        | 800 seconds  |
| Enterprise | 800 seconds  |

```typescript
// For Pro/Enterprise accounts
{
  basePath: "",
  verboseLogs: true,
  maxDuration: 800, // Increase from default 60
  disableSse: true,
}
```

---

## Environment Variables

| Variable              | Description                                    | Required |
| --------------------- | ---------------------------------------------- | -------- |
| `NEXT_PUBLIC_APP_URL` | Your production URL (for landing page display) | Optional |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **MCP Adapter**: [mcp-handler](https://www.npmjs.com/package/mcp-handler)
- **MCP SDK**: [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- **Validation**: [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)

---

## Resources

- [MCP TypeScript SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Vercel MCP Template](https://vercel.com/templates/next.js/model-context-protocol-mcp-with-next-js)
- [mcp-handler npm package](https://www.npmjs.com/package/mcp-handler)

---

## License

MIT © [Ritual Chain](https://github.com/RitualChain)
