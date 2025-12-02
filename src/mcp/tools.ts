import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import axios from 'axios';
import * as z from 'zod/v4';

const BACKEND_URL = (process.env.BACKEND_URL || "http://backend:3000/api").replace(/\/$/, "");

export function registerTools(server: McpServer) {
  server.registerTool(
    "users_balance",
    {
      title: "Get users balance",
      description: "Fetch users balance list from Adonis backend.",
      inputSchema: {
        filters: z.record(z.string(), z.unknown()),
      },
      outputSchema: {
        data: z.unknown(),
      },
    },
    async ({ filters }) => {
      const response = await axios.post(`${BACKEND_URL}/users/balance`, {
        filters: filters ?? {},
      });

      const output = { data: response.data };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    }
  );

  // server.registerTool(...)
}