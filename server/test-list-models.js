require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/genai');

async function listModels() {
  try {
    // If using the official @google/genai SDK directly
    // Let's just fetch the REST API manually to be 100% sure what's going on
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    console.log("Models:", data.models?.map(m => m.name));
  } catch(e) {
    console.error(e);
  }
}
listModels();
