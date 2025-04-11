const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'ID Hotel wajib diisi']
  },
  nama_bank: {
    type: String,
    required: [true, 'Nama bank wajib diisi']
  },
  nomor_rekening: {
    type: String,
    required: [true, 'Nomor rekening wajib diisi']
  },
  nama_rekening: {
    type: String,
    required: [true, 'Nama rekening wajib diisi']
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

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;
