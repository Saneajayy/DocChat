const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const prisma = require('../services/prisma');
const cloudinary = require('../services/cloudinary');
const { getIndex } = require('../services/pinecone');
const { processPdf, getEmbeddings } = require('../services/langchain');

// Temporary local storage for multer
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Upload to Cloudinary
    const cloudinaryRes = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw',
      folder: `docchat/${userId}`
    });

    // 2. Parse PDF and split into chunks
    const { chunks, pageCount } = await processPdf(file.path);

    // 3. Generate embeddings and store in Pinecone
    const pineconeIndex = getIndex();
    
    // Create a unique namespace for this document
    const documentId = uuidv4();
    const pineconeNamespace = `${userId}-${documentId}`;
    
    const chunkTexts = chunks.map(chunk => chunk.pageContent);
    const embeddingsArray = await getEmbeddings(chunkTexts);

    const embeddingsVectors = chunks.map((chunk, i) => ({
      id: `chunk-${i}`,
      values: embeddingsArray[i],
      metadata: {
        text: chunk.pageContent,
        pageNumber: chunk.metadata.loc?.pageNumber || 1,
        chunkIndex: i
      }
    }));

    // Batch upsert to Pinecone
    if (embeddingsVectors.length > 0) {
      // Pinecone accepts max 100 vectors per request usually, we can batch it
      const batchSize = 100;
      for (let i = 0; i < embeddingsVectors.length; i += batchSize) {
        const batch = embeddingsVectors.slice(i, i + batchSize);
        await pineconeIndex.namespace(pineconeNamespace).upsert({ records: batch });
      }
    }

    // 4. Save metadata to Prisma
    // Ensure the user exists in DB
    const userEmail = req.auth.sessionClaims?.email || `${userId}@placeholder.com`;
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: userEmail
      }
    });

    const document = await prisma.document.create({
      data: {
        id: documentId,
        userId: userId,
        name: file.originalname,
        pageCount: pageCount,
        chunkCount: chunks.length,
        cloudinaryUrl: cloudinaryRes.secure_url,
        pineconeNamespace: pineconeNamespace
      }
    });

    // Cleanup local file
    fs.unlinkSync(file.path);

    res.status(200).json({ success: true, document });

  } catch (error) {
    console.error('Upload Error:', error);
    fs.appendFileSync('error.log', new Date().toISOString() + ' - ' + error.stack + '\n');
    // Attempt to cleanup local file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || 'Failed to process document' });
  }
});

module.exports = router;
