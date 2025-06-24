import Typesense from "typesense";

/**
 * Default Typesense configuration from environment variables
 */
export const typesenseConfig = {
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'typesense',
      port: parseInt(process.env.TYPESENSE_PORT || '8108'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 10,
  retryIntervalSeconds: 10,
};

/**
 * Singleton Typesense client instance
 */
export const typesenseClient = new Typesense.Client(typesenseConfig);