import { Client } from "@elastic/elasticsearch";

// Conditional Elasticsearch client - only create if credentials exist
let client: Client | null = null;

// Only create the client if both environment variables are present and properly formatted
if (process.env.ELASTICSEARCH_CLOUD_ID && process.env.ELASTICSEARCH_API_KEY) {
  try {
    client = new Client({
      cloud: {
        id: process.env.ELASTICSEARCH_CLOUD_ID,
      },
      auth: {
        apiKey: process.env.ELASTICSEARCH_API_KEY,
      },
    });
  } catch (error) {
    console.error("Error initializing Elasticsearch client:", error);
  }
}

export default client;
