const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { getIndex } = require('../services/pinecone');

// Get all documents for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ documents });
  } catch (error) {
    console.error('Fetch Documents Error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.auth.userId;
    const documentId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
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

    // 1. Delete from Pinecone
    try {
      const pineconeIndex = getIndex();
      await pineconeIndex.namespace(document.pineconeNamespace).deleteAll();
    } catch (pcError) {
      console.error('Pinecone Delete Error:', pcError);
      // Proceed with deleting from DB anyway
    }

    // 2. Delete chats associated with document
    await prisma.chat.deleteMany({
      where: { documentId: documentId }
    });

    // 3. Delete from Prisma
    await prisma.document.delete({
      where: { id: documentId }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete Document Error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
