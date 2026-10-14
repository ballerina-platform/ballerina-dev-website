// Display metadata only. Complete source files live in action-bbe/<id>.md and
// are copied from the linked sample's .bal file. Keep both repositories in sync.
const base = 'https://github.com/ballerina-guides/integration-samples/tree/main/';

export const examples = [
  {
    id: 'connect-applications', label: 'Connect applications', title: 'GitHub pull requests to Google Sheets',
    description: 'Call the GitHub REST API with an HTTP client, bind the response to typed pull request records, and append each pull request to Google Sheets.',
    source: 'consuming_services/consuming_services.bal', link: base + 'consuming_services',
    diagram: {
      kind: 'image',
      src: '/images/home-page/connect-applications-flow.png',
      alt: 'Flow diagram that gets GitHub pull requests, appends a header row to Google Sheets, and appends one row for each pull request'
    }
  },
  {
    id: 'build-apis', label: 'Build APIs', title: 'RESTful albums API',
    description: 'Serve albums from an in-memory table with list, lookup, and create resources. A request for an album ID returns its details as JSON.',
    source: 'restful_api/main.bal', link: base + 'restful_api',
    diagram: {
      kind: 'image',
      src: '/images/home-page/build-apis-flow.png',
      alt: 'Flow diagram that looks up an album, returns HTTP not found when it is absent, and otherwise returns the album'
    }
  },
  {
    id: 'transform-data', label: 'Transform data', title: 'Customers into contacts',
    description: 'Read customers from JSON, bind them to typed records, select the active customers with a query expression, and transform their email addresses into XML contacts.',
    source: 'working_with_data/working_with_data.bal', link: base + 'working_with_data',
    diagram: {
      kind: 'image',
      src: '/images/home-page/transform-data-flow.png',
      alt: 'Flow diagram that reads customer JSON, binds typed customer records, transforms active customers into XML contacts, and logs the XML'
    }
  },
  {
    id: 'react-to-events', label: 'React to events', title: 'Order event to fulfillment message',
    description: 'Consume batches of orders from Kafka, publish a READY_TO_PACK fulfillment message for each order, and log every published order ID.',
    source: 'kafka_consumer_producer/kafka_consumer_producer.bal', link: base + 'kafka_consumer_producer',
    diagram: {
      kind: 'image',
      src: '/images/home-page/react-to-events-flow.png',
      alt: 'Flow diagram that loops over orders, creates a fulfillment message, publishes it to Kafka, and logs the order ID'
    }
  },
  {
    id: 'add-ai', label: 'Add AI to an integration', title: 'Extract typed order details',
    description: 'Send an order confirmation to an OpenAI model, bind the generated response directly to a typed order record, and log the extracted details.',
    source: 'add_ai_to_integration/main.bal', link: base + 'add_ai_to_integration',
    diagram: {
      kind: 'image',
      src: '/images/home-page/add-ai-flow.png',
      alt: 'Flow diagram that sends an order confirmation to an OpenAI model, binds the generated order details, and logs them'
    }
  },
  {
    id: 'build-agent', label: 'Build an enterprise agent', title: 'Track an order with enterprise tools',
    description: 'Build a delivery assistant that calls order and shipment APIs as agent tools, follows explicit lookup instructions, and answers with the latest status and ETA.',
    source: 'enterprise_agent/main.bal', link: base + 'enterprise_agent',
    diagram: {
      kind: 'image',
      src: '/images/home-page/build-agent-flow.png',
      alt: 'Flow diagram showing an OpenAI-powered delivery agent with order and shipment lookup tools, followed by the agent run and logged answer'
    }
  },
  {
    id: 'expose-mcp', label: 'Expose MCP tools', title: 'Expose product stock through MCP',
    description: 'Expose a stateless MCP service that retrieves typed stock data from an HTTP backend, logs successful lookups, and returns contextual errors when requests fail.',
    source: 'expose_mcp_tools/main.bal', link: base + 'expose_mcp_tools',
    diagram: {
      kind: 'image',
      src: '/images/home-page/expose-mcp-flow.png',
      alt: 'Flow diagram that gets product stock through an HTTP client, handles and logs errors, logs successful lookups, and returns the stock record'
    }
  },
  {
    id: 'coordinate-workflow', label: 'Coordinate a workflow', title: 'Purchase approval',
    description: 'Pause a durable purchase workflow for a human decision, return a clear rejection when approval is denied, or continue to process an approved purchase.',
    source: 'workflow_purchase_approval/main.bal', link: base + 'workflow_purchase_approval',
    diagram: {
      kind: 'image',
      src: '/images/home-page/coordinate-workflow-flow.png',
      alt: 'Workflow diagram that waits for a human approval, returns a rejection when denied, or processes and returns an approved purchase'
    }
  }
];
