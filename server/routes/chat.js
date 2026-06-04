const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { getIndex } = require('../services/pinecone');
const { getEmbeddings, getChatModel } = require('../services/langchain');
const { HumanMessage } = require('@langchain/core/messages');

// Get chat history for a document
router.get('/:documentId', async (req, res) => {
  try {
    const userId = req.auth.userId;
    const documentId = req.params.documentId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let chat = await prisma.chat.findFirst({
      where: {
        userId,
        documentId
      }
    });

    res.status(200).json({ chat });
  } catch (error) {
    console.error('Fetch Chat History Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Send a message and get a RAG response
router.post('/', async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { documentId, question, history } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!documentId || !question) {
      return res.status(400).json({ error: 'Missing documentId or question' });
    }

    if (typeof question !== 'string' || question.trim().length === 0 || question.length > 1000) {
      return res.status(400).json({ error: 'Question must be a valid string under 1000 characters' });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // 1. Embed question
    const queryEmbeddings = await getEmbeddings([question]);
    const queryEmbedding = queryEmbeddings[0];

    // 2. Query Pinecone
    const pineconeIndex = getIndex();
    const queryResponse = await pineconeIndex.namespace(document.pineconeNamespace).query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true
    });

    // 3. Build prompt
    const contexts = queryResponse.matches.map(match => match.metadata.text).join('\n\n---\n\n');
    
    const prompt = `Answer the question based only on the context below.
If the answer is not in the context, say 'I don't know'.

Context:
${contexts}

Question: ${question}`;

    // 4. Send to Gemini
    const chatModel = getChatModel();
    const response = await chatModel.invoke([new HumanMessage(prompt)]);
    const answer = response.content;

    // 5. Save to chat history
    let chat = await prisma.chat.findFirst({
      where: {
        userId,
        documentId
      }
    });

    const newMessages = history ? [...history, { role: 'assistant', content: answer }] : [
      { role: 'user', content: question },
      { role: 'assistant', content: answer }
    ];

    if (chat) {
      await prisma.chat.update({
        where: { id: chat.id },
        data: { messages: newMessages }
      });
    } else {
      await prisma.chat.create({
        data: {
          userId,
          documentId,
          messages: newMessages
        }
      });
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;
