require('dotenv').config();
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');

async function test() {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: 'gemini-embedding-2',
      apiKey: process.env.GEMINI_API_KEY,
    });
    const res = await embeddings.embedQuery("Hello world");
    console.log("Success gemini-embedding-2! Length:", res.length);
  } catch (e) {
    console.error("Error gemini-embedding-2:", e.message);
  }
}

test();
