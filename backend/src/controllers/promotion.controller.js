const Promotion = require('../models/promotion.model');

exports.createPromotion = async (req, res) => {
  try {
    const { hotel_id, nama_promo, deskripsi, periode_mulai, periode_selesai, diskon_persen, tipe_promo } = req.body;
    
    const startDate = new Date(periode_mulai);
    const endDate = new Date(periode_selesai);
    
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Periode selesai harus setelah periode mulai'
      });
    }
    
    const promotion = new Promotion({
      hotel_id,
      nama_promo,
      deskripsi,
      periode_mulai: startDate,
      periode_selesai: endDate,
      diskon_persen,
      tipe_promo
    });
    
    await promotion.save();
    
    res.status(201).json({
      success: true,
      message: 'Promosi berhasil ditambahkan',
      data: promotion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan promosi',
      error: error.message
    });
  }
};

exports.getPromotionsByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { active } = req.query;
    
    const query = { hotel_id: hotelId };
    
    if (active === 'true') {
      const now = new Date();
      query.periode_mulai = { $lte: now };
      query.periode_selesai = { $gte: now };
    }
    
    const promotions = await Promotion.find(query).sort({ periode_mulai: 1 });
    
    res.status(200).json({
      success: true,
      count: promotions.length,
      data: promotions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data promosi',
      error: error.message
    });
  }
};

exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promosi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data promosi',
      error: error.message
    });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const { nama_promo, deskripsi, periode_mulai, periode_selesai, diskon_persen, tipe_promo } = req.body;
    
    if (periode_mulai && periode_selesai) {
      const startDate = new Date(periode_mulai);
      const endDate = new Date(periode_selesai);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: 'Periode selesai harus setelah periode mulai'
        });
      }
    }
    
    const updateData = {
      nama_promo,
      deskripsi,
      periode_mulai: periode_mulai ? new Date(periode_mulai) : undefined,
      periode_selesai: periode_selesai ? new Date(periode_selesai) : undefined,
      diskon_persen,
      tipe_promo
    };
    
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promosi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Promosi berhasil diperbarui',
      data: promotion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui promosi',
      error: error.message
    });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promosi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Promosi berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus promosi',
      error: error.message
    });
  }
};
