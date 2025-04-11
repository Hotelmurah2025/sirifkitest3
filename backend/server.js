const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

const { MongoMemoryServer } = require('mongodb-memory-server');

async function startServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB');
    
    app.use('/api/auth', require('./src/routes/auth.routes'));
    app.use('/api/users', require('./src/routes/user.routes'));
    app.use('/api/hotels', require('./src/routes/hotel.routes'));
    app.use('/api/rooms', require('./src/routes/room.routes'));
    app.use('/api/availability', require('./src/routes/availability.routes'));
    app.use('/api/reservations', require('./src/routes/reservation.routes'));
    app.use('/api/promotions', require('./src/routes/promotion.routes'));
    app.use('/api/transactions', require('./src/routes/transaction.routes'));
    app.use('/api/bank-accounts', require('./src/routes/bankAccount.routes'));
    app.use('/api/uploads', require('./src/routes/upload.routes'));
    app.use('/api/dashboard', require('./src/routes/dashboard.routes'));
    app.use('/api/rateplans', require('./src/routes/rateplan.routes'));
    
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Selamat datang di API Extranet Hotel',
        version: '1.0.0',
        documentation: '/api-docs'
      });
    });
    
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: 'Maaf, terjadi kesalahan pada server. Silakan coba lagi.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });
    
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
      });
    });
    
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT}`);
      console.log(`Catatan: Database menggunakan in-memory MongoDB dan akan hilang saat server di-restart`);
    });
  } catch (error) {
    console.error('Gagal terhubung ke database:', error);
    process.exit(1);
  }
}

startServer();
