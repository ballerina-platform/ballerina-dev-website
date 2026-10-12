---
title: 'Your integrations. Ready for other agents.'
id: 'mcp'
description: "Expose enterprise capabilities as MCP tools that compatible AI applications can discover and call. Connect Ballerina agents to external MCP servers using the same open protocol."
details: "Order lookup, returns, and refunds are published once as MCP tools. Their names, descriptions, and input schemas are generated from `remote` functions and their documentation. The customer-facing agent sets `permittedTools`, so its model sees only order lookup and returns. That limits what the model can choose; it is not authorization. Protect back-office tools such as `issueRefund` on the server with `httpConfig.auth` and scopes, or publish them on a separate endpoint. The descriptions guide the model, and the tool code enforces the business rules. Tested with `ballerina/mcp` 1.3.0 on Ballerina 2201.13.6. The module implements the Streamable HTTP transport and MCP tools (`initialize`, `tools/list`, and `tools/call`). It does not implement resources, prompts, sampling, or stdio, so a client must support Streamable HTTP and MCP tools."
guide: { label: 'Connect integrations and agents through MCP', url: '/learn/connect-integrations-and-agents-through-mcp/' }
samples:
  - { label: 'Agent with MCP integration (BBE)', url: '/learn/by-example/ai-agent-mcp-integration/' }
  - { label: 'MCP shopping server (GitHub)', url: 'https://github.com/ballerina-platform/module-ballerina-mcp/tree/main/examples/servers/mcp-shopping-server' }
  - { label: 'MCP shopping client (GitHub)', url: 'https://github.com/ballerina-platform/module-ballerina-mcp/tree/main/examples/clients/mcp-shopping-client' }
tabs:
  - { key: 'server', title: 'MCP server' }
  - { key: 'client', title: 'Agent (client)' }
  - { key: 'sequence', title: 'Sequence' }
  - { key: 'result', title: 'Result' }
---
