const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  nama_hotel: {
    type: String,
    required: [true, 'Nama hotel wajib diisi']
  },
  alamat: {
    type: String,
    required: [true, 'Alamat wajib diisi']
  },
  kota: {
    type: String,
    required: [true, 'Kota wajib diisi']
  },
  deskripsi: {
    type: String,
    required: [true, 'Deskripsi wajib diisi']
  },
  fasilitas: [{
    type: String
  }],
  foto_cover: {
    type: String,
    default: 'default-hotel.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
