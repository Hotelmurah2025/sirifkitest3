const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'ID Hotel wajib diisi']
  },
  reservation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: [true, 'ID Reservasi wajib diisi']
  },
  jumlah_total: {
    type: Number,
    required: [true, 'Jumlah total wajib diisi'],
    min: [0, 'Jumlah total tidak boleh negatif']
  },
  status_pembayaran: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending'
  },
  tanggal_pembayaran: {
    type: Date
  },
  metode_pembayaran: {
    type: String
  },
  bukti_pembayaran: {
    type: String
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

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
