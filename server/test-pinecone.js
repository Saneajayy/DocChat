require('dotenv').config();
const { getIndex } = require('./services/pinecone');

async function testPinecone() {
  try {
    const pineconeIndex = getIndex();
    const stats = await pineconeIndex.describeIndexStats();
    console.log('Success:', stats);
  } catch (err) {
    console.error('Pinecone Error:', err.message);
  }
}

testPinecone();
