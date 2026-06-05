// server/services/pinecone.js
// Lazy‑initialised Pinecone client – avoids crashes when env vars are missing during Vercel cold start.
const { Pinecone } = require('@pinecone-database/pinecone');

let pineconeClient = null;

/**
 * Returns a ready‑to‑use Pinecone client.
 * The client is created on first call, after Vercel has injected env vars.
 */
function getClient() {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    const environment = process.env.PINECONE_ENVIRONMENT || process.env.PINECONE_REGION;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not set – please add it to Vercel env vars.');
    }
    pineconeClient = new Pinecone({ apiKey, environment });
  }
  return pineconeClient;
}

/**
 * Convenience wrapper used in the upload route.
 * Returns the index object for the configured index name.
 */
function getIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME;
  if (!indexName) {
    throw new Error('PINECONE_INDEX_NAME is not set – please add it to Vercel env vars.');
  }
  return getClient().index(indexName);
}

module.exports = { getClient, getIndex };
