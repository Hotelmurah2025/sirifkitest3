const RatePlan = require('../models/rateplan.model');
const Room = require('../models/room.model');

exports.createRatePlan = async (req, res) => {
  try {
    const { 
      room_id, 
      nama_rateplan, 
      deskripsi, 
      harga_dasar, 
      periode_mulai, 
      periode_selesai,
      hari_dalam_minggu,
      kebijakan_pembatalan,
      termasuk_sarapan,
      minimum_malam,
      maksimum_malam,
      status,
      prioritas
    } = req.body;
    
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    const ratePlan = new RatePlan({
      room_id,
      nama_rateplan,
      deskripsi,
      harga_dasar,
      periode_mulai,
      periode_selesai,
      hari_dalam_minggu: hari_dalam_minggu || {
        senin: true,
        selasa: true,
        rabu: true,
        kamis: true,
        jumat: true,
        sabtu: true,
        minggu: true
      },
      kebijakan_pembatalan,
      termasuk_sarapan,
      minimum_malam: minimum_malam || 1,
      maksimum_malam: maksimum_malam || 30,
      status: status || 'active',
      prioritas: prioritas || 0
    });
    
    await ratePlan.save();
    
    res.status(201).json({
      success: true,
      message: 'Rate plan berhasil ditambahkan',
      data: ratePlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan rate plan',
      error: error.message
    });
  }
};

exports.getRatePlansByRoomId = async (req, res) => {
  try {
    const ratePlans = await RatePlan.find({ room_id: req.params.roomId })
      .sort({ prioritas: -1, periode_mulai: 1 });
    
    res.status(200).json({
      success: true,
      count: ratePlans.length,
      data: ratePlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rate plan',
      error: error.message
    });
  }
};

exports.getRatePlanById = async (req, res) => {
  try {
    const ratePlan = await RatePlan.findById(req.params.id);
    
    if (!ratePlan) {
      return res.status(404).json({
        success: false,
        message: 'Rate plan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: ratePlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rate plan',
      error: error.message
    });
  }
};

exports.updateRatePlan = async (req, res) => {
  try {
    const ratePlan = await RatePlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!ratePlan) {
      return res.status(404).json({
        success: false,
        message: 'Rate plan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Rate plan berhasil diperbarui',
      data: ratePlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui rate plan',
      error: error.message
    });
  }
};

exports.deleteRatePlan = async (req, res) => {
  try {
    const ratePlan = await RatePlan.findByIdAndDelete(req.params.id);
    
    if (!ratePlan) {
      return res.status(404).json({
        success: false,
        message: 'Rate plan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Rate plan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus rate plan',
      error: error.message
    });
  }
};

exports.getApplicableRatePlans = async (req, res) => {
  try {
    const { room_id, check_in, check_out, jumlah_malam } = req.query;
    
    if (!room_id || !check_in) {
      return res.status(400).json({
        success: false,
        message: 'Parameter room_id dan check_in wajib diisi'
      });
    }
    
    const checkInDate = new Date(check_in);
    const dayOfWeek = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'][checkInDate.getDay()];
    
    
    const query = {
      room_id,
      periode_mulai: { $lte: checkInDate },
      periode_selesai: { $gte: checkInDate },
      [`hari_dalam_minggu.${dayOfWeek}`]: true,
      status: 'active'
    };
    
    if (jumlah_malam) {
      query.minimum_malam = { $lte: parseInt(jumlah_malam) };
      query.maksimum_malam = { $gte: parseInt(jumlah_malam) };
    }
    
    const ratePlans = await RatePlan.find(query)
      .sort({ prioritas: -1 });
    
    res.status(200).json({
      success: true,
      count: ratePlans.length,
      data: ratePlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mencari rate plan yang sesuai',
      error: error.message
    });
  }
};
