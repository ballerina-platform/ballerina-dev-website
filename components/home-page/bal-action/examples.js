// Display metadata only. Complete source files live in action-bbe/<id>.md and
// are copied from the linked sample's .bal file. Keep both repositories in sync.
const base = 'https://github.com/ballerina-guides/integration-samples/tree/main/';

export const examples = [
  {
    id: 'connect-applications', label: 'Connect applications', title: 'GitHub pull requests to Google Sheets',
    description: 'Use the GitHub and Google Sheets connectors to read open pull requests and append their URL, title, state, and timestamps to a sheet.',
    source: 'consuming_services/consuming_services.bal', link: base + 'consuming_services',
    diagram: {kind: 'sequence', nodes: ['Ballerina', 'GitHub', 'Google Sheets'], steps: [['Ballerina', 'GitHub', 'Read pull requests'], ['GitHub', 'Ballerina', 'Pull request records'], ['Ballerina', 'Google Sheets', 'Append rows']]}
  },
  {
    id: 'build-apis', label: 'Build APIs', title: 'RESTful albums API',
    description: 'Serve albums from an in-memory table with list, lookup, and create resources. A request for an album ID returns its details as JSON.',
    source: 'restful_api/main.bal', link: base + 'restful_api',
    diagram: {kind: 'sequence', nodes: ['Client', 'Albums API', 'Album table'], steps: [['Client', 'Albums API', 'GET /albums/1'], ['Albums API', 'Album table', 'Look up album'], ['Albums API', 'Client', 'Album JSON']]}
  },
  {
    id: 'transform-data', label: 'Transform data', title: 'Customers into contacts',
    description: 'Read customers as JSON, filter and map active records with a query expression, then produce native JSON and XML contact values.',
    source: 'working_with_data/working_with_data.bal', link: base + 'working_with_data',
    diagram: {kind: 'mapping', nodes: ['JSON customers', 'Filter active → map fields', 'JSON + XML contacts']}
  },
  {
    id: 'react-to-events', label: 'React to events', title: 'Order event to fulfillment message',
    description: 'Consume an order from Kafka and publish a compact fulfillment message for the next service.',
    source: 'kafka_consumer_producer/kafka_consumer_producer.bal', link: base + 'kafka_consumer_producer',
    diagram: {kind: 'sequence', nodes: ['Orders topic', 'Ballerina', 'Fulfillment topic'], steps: [['Orders topic', 'Ballerina', 'Consume order'], ['Ballerina', 'Fulfillment topic', 'Publish READY_TO_PACK']]}
  },
  {
    id: 'add-ai', label: 'Add AI to an integration', title: 'Classify a support message',
    description: 'Send a support message to a model, bind its response to a typed record, and validate the allowed values before routing.',
    source: 'add_ai_to_integration/main.bal', link: base + 'add_ai_to_integration',
    diagram: {kind: 'sequence', nodes: ['Support message', 'Ballerina', 'Model'], steps: [['Support message', 'Ballerina', 'Submit text'], ['Ballerina', 'Model', 'Request classification'], ['Model', 'Ballerina', 'Typed result']]}
  },
  {
    id: 'build-agent', label: 'Build an enterprise agent', title: 'Answer a delivery question',
    description: 'An agent can use order lookup and shipment lookup to answer when an order will arrive. These are its only two tools.',
    source: 'enterprise_agent/main.bal', link: base + 'enterprise_agent',
    diagram: {kind: 'sequence', nodes: ['User', 'Agent', 'Orders', 'Shipments'], steps: [['User', 'Agent', 'Ask about O-100'], ['Agent', 'Orders', 'lookupOrder'], ['Agent', 'Shipments', 'lookupShipment'], ['Agent', 'User', 'Answer with ETA']]}
  },
  {
    id: 'expose-mcp', label: 'Expose MCP tools', title: 'Product stock for external AI apps',
    description: 'Expose a product-stock lookup as an MCP tool. A compatible client can discover it and ask for stock by product ID.',
    source: 'expose_mcp_tools/main.bal', link: base + 'expose_mcp_tools',
    diagram: {kind: 'sequence', nodes: ['MCP client', 'Ballerina tool', 'Stock service'], steps: [['MCP client', 'Ballerina tool', 'getProductStock(P-100)'], ['Ballerina tool', 'Stock service', 'GET /stock/P-100'], ['Ballerina tool', 'MCP client', 'available: 12']]}
  },
  {
    id: 'coordinate-workflow', label: 'Coordinate a workflow', title: 'Purchase approval',
    description: 'Submit a purchase request, wait for a manager to approve it, then continue with processing.',
    source: 'workflow_purchase_approval/main.bal', link: base + 'workflow_purchase_approval',
    diagram: {kind: 'workflow', nodes: ['Submitted', 'Waiting for manager', 'Approved', 'Processed']}
  }
];
