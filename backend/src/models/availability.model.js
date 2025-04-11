const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'ID Kamar wajib diisi']
  },
  tanggal: {
    type: Date,
    required: [true, 'Tanggal wajib diisi']
  },
  jumlah_kamar_tersedia: {
    type: Number,
    required: [true, 'Jumlah kamar tersedia wajib diisi'],
    min: [0, 'Jumlah kamar tidak boleh negatif']
  },
  harga_per_malam: {
    type: Number,
    required: [true, 'Harga per malam wajib diisi'],
    min: [0, 'Harga kamar tidak boleh negatif']
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

availabilitySchema.index({ room_id: 1, tanggal: 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
