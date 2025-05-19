import { Client } from "@elastic/elasticsearch";

// Default to a mock client when environment variables are not set
let client: Client;

// Only initialize the real client if both env variables are properly set
if (process.env.ELASTICSEARCH_CLOUD_ID && process.env.ELASTICSEARCH_API_KEY) {
  client = new Client({
    cloud: {
      id: process.env.ELASTICSEARCH_CLOUD_ID,
    },
    auth: {
      apiKey: process.env.ELASTICSEARCH_API_KEY,
    },
  });
} else {
  // Create a mock client that will gracefully fail
  client = {
    bulk: async () => ({ errors: false, items: [] }),
    search: async () => ({ hits: { hits: [] } }),
    // Add any other methods used in your app
  } as any as Client;
  
  console.warn('Elasticsearch credentials not found. Using mock client.');
}

export default client;
