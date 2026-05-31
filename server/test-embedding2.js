require('dotenv').config();
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');

async function test() {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-2',
      apiKey: process.env.GEMINI_API_KEY,
    });
    const res = await embeddings.embedQuery("Hello world");
    console.log("Success text-embedding-004! Length:", res.length);
  } catch (e) {
    console.error("Error text-embedding-004:", e.message);
  }
}

test();
