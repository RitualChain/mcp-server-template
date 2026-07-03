import { createMcpHandler } from "mcp-handler"
import { NextResponse } from "next/server"
import { z } from "zod"
import { isAddress } from "viem"
import {
  getRitualWalletBalance,
  getActiveExecutors,
  getChainStatus,
  getAvailableModels,
  CAPABILITY,
} from "@/lib/ritual-chain"

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "echo",
      "Echo back a message to verify input/output communication",
      { message: z.string() },
      async ({ message }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      })
    )

    server.tool(
      "get_server_time",
      "Returns the current server time and timezone information",
      {},
      async () => ({
        content: [{ type: "text", text: JSON.stringify({ serverTime: new Date().toISOString(), timestamp: Date.now() }, null, 2) }],
      })
    )

    server.tool(
      "get_ritual_chain_status",
      "Returns Ritual Chain (Chain ID 1979) status: block number, gas price, RPC/explorer/faucet URLs. Call this first to verify connectivity before submitting any transaction.",
      {},
      async () => {
        try {
          const status = await getChainStatus()
          return { content: [{ type: "text", text: JSON.stringify(status, null, 2) }] }
        } catch (err) {
          return { content: [{ type: "text", text: JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }) }], isError: true }
        }
      }
    )

    server.tool(
      "get_ritual_wallet_balance",
      "Returns RitualWallet balance and lock status for an address on Ritual Chain. RitualWallet funds async precompile calls (HTTP 0x0801, LLM 0x0802, agents). Minimum 0.4 RITUAL required before LLM calls. hasEnoughForLLM field indicates readiness.",
      { address: z.string().describe("Ethereum address (0x...) to check") },
      async ({ address }) => {
        if (!isAddress(address)) {
          return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid Ethereum address" }) }], isError: true }
        }
        try {
          const result = await getRitualWalletBalance(address as `0x${string}`)
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
        } catch (err) {
          return { content: [{ type: "text", text: JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }) }], isError: true }
        }
      }
    )

    server.tool(
      "get_ritual_executors",
      "Returns active TEE executor addresses from TEEServiceRegistry for HTTP or LLM precompile. Pass the returned teeAddress as the executor field in precompile ABI calls. capability: http=0x0801, llm=0x0802.",
      { capability: z.enum(["http", "llm"]).describe("http for HTTP precompile (0x0801), llm for LLM precompile (0x0802)") },
      async ({ capability }) => {
        try {
          const cap = capability === "http" ? CAPABILITY.HTTP_CALL : CAPABILITY.LLM_CALL
          const executors = await getActiveExecutors(cap)
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                capability,
                precompile: capability === "http" ? "0x0801" : "0x0802",
                count: executors.length,
                executors,
                note: "Use teeAddress as the executor parameter in precompile calls",
              }, null, 2),
            }],
          }
        } catch (err) {
          return { content: [{ type: "text", text: JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }) }], isError: true }
        }
      }
    )

    server.tool(
      "get_ritual_models",
      "Returns registered AI models from ModelPricingRegistry on Ritual Chain. Only zai-org/GLM-4.7-FP8 is live for production. Always pin to productionModel for LLM precompile calls.",
      {},
      async () => {
        try {
          const models = await getAvailableModels()
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ models, productionModel: "zai-org/GLM-4.7-FP8", note: "Pin to productionModel for all current Ritual Chain LLM calls" }, null, 2),
            }],
          }
        } catch (err) {
          return { content: [{ type: "text", text: JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }) }], isError: true }
        }
      }
    )
  },
  { capabilities: { tools: {} } },
  { basePath: "", verboseLogs: true, maxDuration: 60, disableSse: true }
)

export async function GET() {
  return NextResponse.json({
    name: "Ritual Chain MCP Server",
    version: "0.2.0",
    protocol: "Model Context Protocol (MCP)",
    transport: "Streamable HTTP",
    chain: { id: 1979, name: "Ritual", rpc: "https://rpc.ritualfoundation.org", explorer: "https://explorer.ritualfoundation.org" },
    tools: ["echo", "get_server_time", "get_ritual_chain_status", "get_ritual_wallet_balance", "get_ritual_executors", "get_ritual_models"],
  })
}

export { handler as POST, handler as DELETE }
