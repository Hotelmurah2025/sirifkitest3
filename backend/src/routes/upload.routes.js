const express = require('express');
const router = express.Router();
const { uploadImage, uploadCSV } = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');
const path = require('path');

router.post('/image', verifyToken, uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada file yang diunggah'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'File berhasil diunggah',
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengunggah file',
      error: error.message
    });
  }
});

router.post('/images', verifyToken, uploadImage.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada file yang diunggah'
      });
    }
    
    const filesData = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }));
    
    res.status(200).json({
      success: true,
      message: `${req.files.length} file berhasil diunggah`,
      data: filesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengunggah file',
      error: error.message
    });
  }
});

router.get('/:filename', (req, res) => {
  const uploadDir = process.env.UPLOAD_PATH || './uploads';
  const filePath = path.join(uploadDir, req.params.filename);
  res.sendFile(filePath);
});

module.exports = router;
