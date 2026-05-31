require('dotenv').config();
const cloudinary = require('./services/cloudinary');
const fs = require('fs');

fs.writeFileSync('dummy.pdf', 'dummy content');

async function testCloudinary() {
  try {
    const res = await cloudinary.uploader.upload('dummy.pdf', {
      resource_type: 'raw',
      folder: 'test'
    });
    console.log('Success:', res.secure_url);
  } catch (err) {
    console.error('Cloudinary Error:', err.message);
  } finally {
    fs.unlinkSync('dummy.pdf');
  }
}

testCloudinary();
