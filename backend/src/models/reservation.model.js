const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'ID Hotel wajib diisi']
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'ID Kamar wajib diisi']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nama_tamu: {
    type: String,
    required: [true, 'Nama tamu wajib diisi']
  },
  check_in: {
    type: Date,
    required: [true, 'Tanggal check-in wajib diisi']
  },
  check_out: {
    type: Date,
    required: [true, 'Tanggal check-out wajib diisi']
  },
  jumlah_tamu: {
    type: Number,
    required: [true, 'Jumlah tamu wajib diisi'],
    min: [1, 'Jumlah tamu minimal 1 orang']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
    default: 'pending'
  },
  catatan: {
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

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
