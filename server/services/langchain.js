const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const fs = require('fs');

// Vercel bundle fix: Statically require pdf-parse so @vercel/nft includes it in the serverless function
require('pdf-parse');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const getEmbeddings = async (texts) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });

  const embeddings = await Promise.all(
    texts.map(async (text) => {
      const result = await model.embedContent(text);
      return result.embedding.values;
    })
  );

  return embeddings;
};

const getChatModel = () => {
  return new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.2,
  });
};

const processPdf = async (filePath) => {
  // Load PDF
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  // Calculate total pages (docs is an array where each item is usually a page)
  const pageCount = docs.length;

  // Split text
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await textSplitter.splitDocuments(docs);

  return {
    chunks,
    pageCount
  };
};

module.exports = {
  getEmbeddings,
  getChatModel,
  processPdf
};
