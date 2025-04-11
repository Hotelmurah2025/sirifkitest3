const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'ID Hotel wajib diisi']
  },
  nama_kamar: {
    type: String,
    required: [true, 'Nama kamar wajib diisi']
  },
  tipe_tempat_tidur: {
    type: String,
    required: [true, 'Tipe tempat tidur wajib diisi']
  },
  fasilitas_kamar: [{
    type: String
  }],
  harga_default: {
    type: Number,
    required: [true, 'Harga default wajib diisi'],
    min: [0, 'Harga kamar tidak boleh negatif']
  },
  foto_kamar: [{
    type: String
  }],
  kapasitas: {
    type: Number,
    default: 2,
    min: [1, 'Kapasitas kamar minimal 1 orang']
  },
  jumlah_kamar: {
    type: Number,
    default: 1,
    min: [1, 'Jumlah kamar minimal 1']
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

roomSchema.virtual('rateplans', {
  ref: 'RatePlan',
  localField: '_id',
  foreignField: 'room_id'
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
