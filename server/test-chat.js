require('dotenv').config();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

async function test() {
  try {
    const chat = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GEMINI_API_KEY,
    });
    const res = await chat.invoke("Hello");
    console.log("Chat Success:", res.content);
  } catch (e) {
    console.error("Chat Error:", e.message);
  }
}
test();
