const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// Using a default index name if not specified in env
const getIndex = () => pc.index(process.env.PINECONE_INDEX_NAME || 'docchat');

module.exports = {
  pc,
  getIndex
};
