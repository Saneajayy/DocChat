require('dotenv').config();
const { getIndex } = require('./services/pinecone');

async function testUpsert() {
  try {
    const pineconeIndex = getIndex();
    const batch = [{
      id: "test-id",
      values: Array(768).fill(0.1),
      metadata: { text: "test" }
    }];
    await pineconeIndex.namespace("test").upsert(batch);
    console.log("Success with array directly");
  } catch(e) {
    console.error("Array error:", e.message);
  }

  try {
    const pineconeIndex = getIndex();
    const batch = [{
      id: "test-id",
      values: Array(768).fill(0.1),
      metadata: { text: "test" }
    }];
    await pineconeIndex.namespace("test").upsert({ records: batch });
    console.log("Success with { records: batch }");
  } catch(e) {
    console.error(e);
  }
}
testUpsert();
