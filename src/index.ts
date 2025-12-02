import "dotenv/config"
import express from "express"
import cors from "cors"
import axios from "axios"

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import * as z from "zod/v4"

// ----------------------------------
// CONFIG
// ----------------------------------
const PORT = Number(process.env.PORT || 3000)
const BACKEND_URL = (process.env.BACKEND_URL || "http://backend:3000/api").replace(/\/$/, "")

console.log("🚀 Starting MCP Server (Streamable HTTP + Express)…")
console.log("🔗 BACKEND_URL:", BACKEND_URL)

// ----------------------------------
// MCP INSTANCE (се креира само еднаш)
// ----------------------------------
const server = new McpServer({
  name: "sentice-mcp-server",
  version: "1.0.0",
})

// ----------------------------------
// TOOLS
// ----------------------------------
server.registerTool(
  "users_balance",
  {
    title: "Get users balance",
    description: "Fetch users balance list from Adonis backend.",
    inputSchema: {
      filters: z.record(z.string(), z.unknown()).optional(),
    },
    outputSchema: {
      data: z.unknown(),
    },
  },
  async ({ filters }) => {
    const response = await axios.post(`${BACKEND_URL}/users/balance`, {
      filters: filters ?? {},
    })

    const output = { data: response.data }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(output, null, 2),
        },
      ],
      structuredContent: output,
    }
  }
)

// ----------------------------------
// EXPRESS + MCP STREAMABLE HTTP
// ----------------------------------
async function main() {
  const app = express()

  app.use(cors({ origin: "*", exposedHeaders: ["Mcp-Session-Id"] }))
  app.use(express.json({ limit: "10mb" }))

  // Health check ендпоинт
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Единствен MCP endpoint
  app.post("/mcp", async (req, res) => {
    // ✔ Усогласено со официјалниот пример
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    // ✔ Закачи cleanup функција за овој специфичен транспорт
    res.on("close", () => {
      transport.close();
    });

    // ✔ Точен редослед според документацијата
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.listen(PORT, () => {
    console.log(`🎉 MCP Server running at http://0.0.0.0:${PORT}/mcp`)
  }).on("error", (error) => {
    console.error("❌ Server error:", error)
    process.exit(1)
  })
}

main().catch((err) => {
  console.error("❌ Failed to start MCP server:", err)
  process.exit(1)
})
