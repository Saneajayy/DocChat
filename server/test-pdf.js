const { processPdf } = require('./services/langchain');
const fs = require('fs');

async function run() {
  try {
    // We need a dummy PDF. We'll just check if PDFLoader can be required properly first.
    const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
    console.log("PDFLoader loaded successfully.");
    console.log(typeof PDFLoader);
  } catch (e) {
    console.error("Error loading PDFLoader:", e);
  }
}
run();
