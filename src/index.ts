import "dotenv/config"
import express, { Request, Response } from "express"
import cors from "cors"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { registerMcpItems } from "./mcp/register.js"

// ----------------------------------
// CONFIG
// ----------------------------------
const PORT = Number(process.env.PORT || 3000)
const BACKEND_URL = (process.env.BACKEND_URL || "http://backend:3000/api").replace(/\/$/, "")

console.log("🚀 Starting MCP Server (Streamable HTTP + Express)…")
console.log("🔗 BACKEND_URL:", BACKEND_URL)

// ----------------------------------
// MCP INSTANCE
// ----------------------------------
const server = new McpServer({
  name: "sentice-mcp-server",
  version: "1.0.0",
})

registerMcpItems(server);

// ----------------------------------
// EXPRESS + MCP STREAMABLE HTTP
// ----------------------------------
async function main() {
  const app = express()

  app.use(cors({ origin: "*", exposedHeaders: ["Mcp-Session-Id"] }))
  app.use(express.json({ limit: "10mb" }))

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  const mcpHandler = async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    res.on("close", () => {
      transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  };

  app.get("/mcp", mcpHandler);
  app.post("/mcp", mcpHandler);


  app.listen(PORT, () => {
    console.log(`🎉 MCP Server running`)

  }).on("error", (error) => {
    console.error("❌ Server error:", error)
    process.exit(1)
  })
}

main().catch((err) => {
  console.error("❌ Failed to start MCP server:", err)
  process.exit(1)
})
