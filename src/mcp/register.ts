import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerPrompts } from './prompts.js';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';

export function registerMcpItems(server: McpServer) {
  console.log('⚙️  Registering MCP items...');
  registerTools(server);
  registerResources(server);
  registerPrompts(server);
  console.log('✅ MCP items registered.');
}