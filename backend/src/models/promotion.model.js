const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'ID Hotel wajib diisi']
  },
  nama_promo: {
    type: String,
    required: [true, 'Nama promo wajib diisi']
  },
  deskripsi: {
    type: String,
    required: [true, 'Deskripsi promo wajib diisi']
  },
  periode_mulai: {
    type: Date,
    required: [true, 'Periode mulai wajib diisi']
  },
  periode_selesai: {
    type: Date,
    required: [true, 'Periode selesai wajib diisi']
  },
  diskon_persen: {
    type: Number,
    required: [true, 'Persentase diskon wajib diisi'],
    min: [0, 'Diskon tidak boleh negatif'],
    max: [100, 'Diskon tidak boleh lebih dari 100%']
  },
  tipe_promo: {
    type: String,
    enum: ['early_bird', 'last_minute', 'seasonal', 'other'],
    default: 'other'
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

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
