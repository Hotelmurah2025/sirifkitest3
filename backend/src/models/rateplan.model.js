const mongoose = require('mongoose');

const ratePlanSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  nama_rateplan: {
    type: String,
    required: true,
    trim: true
  },
  deskripsi: {
    type: String,
    trim: true
  },
  harga_dasar: {
    type: Number,
    required: true,
    min: 0
  },
  periode_mulai: {
    type: Date,
    required: true
  },
  periode_selesai: {
    type: Date,
    required: true
  },
  hari_dalam_minggu: {
    senin: { type: Boolean, default: true },
    selasa: { type: Boolean, default: true },
    rabu: { type: Boolean, default: true },
    kamis: { type: Boolean, default: true },
    jumat: { type: Boolean, default: true },
    sabtu: { type: Boolean, default: true },
    minggu: { type: Boolean, default: true }
  },
  kebijakan_pembatalan: {
    type: String,
    enum: ['non_refundable', 'free_cancellation', 'partial_refund'],
    default: 'free_cancellation'
  },
  termasuk_sarapan: {
    type: Boolean,
    default: false
  },
  minimum_malam: {
    type: Number,
    default: 1,
    min: 1
  },
  maksimum_malam: {
    type: Number,
    default: 30,
    min: 1
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  prioritas: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

ratePlanSchema.pre('validate', function(next) {
  if (this.periode_mulai && this.periode_selesai) {
    if (this.periode_mulai > this.periode_selesai) {
      this.invalidate('periode_selesai', 'Periode selesai harus setelah periode mulai');
    }
  }
  next();
});

ratePlanSchema.pre('validate', function(next) {
  if (this.minimum_malam > this.maksimum_malam) {
    this.invalidate('maksimum_malam', 'Maksimum malam harus lebih besar atau sama dengan minimum malam');
  }
  next();
});

const RatePlan = mongoose.model('RatePlan', ratePlanSchema);

module.exports = RatePlan;
