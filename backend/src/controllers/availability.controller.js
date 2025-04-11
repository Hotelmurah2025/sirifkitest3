const Availability = require('../models/availability.model');
const Room = require('../models/room.model');
const RatePlan = require('../models/rateplan.model');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

exports.createOrUpdateAvailability = async (req, res) => {
  try {
    const { room_id, tanggal, jumlah_kamar_tersedia, harga_per_malam } = req.body;
    
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    const checkDate = new Date(tanggal);
    const dayOfWeek = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'][checkDate.getDay()];
    
    const applicableRatePlan = await RatePlan.findOne({
      room_id,
      periode_mulai: { $lte: checkDate },
      periode_selesai: { $gte: checkDate },
      [`hari_dalam_minggu.${dayOfWeek}`]: true,
      status: 'active'
    }).sort({ prioritas: -1 });
    
    const finalPrice = harga_per_malam || (applicableRatePlan ? applicableRatePlan.harga_dasar : room.harga_default);
    
    let availability = await Availability.findOne({ room_id, tanggal });
    
    if (availability) {
      availability.jumlah_kamar_tersedia = jumlah_kamar_tersedia;
      availability.harga_per_malam = finalPrice;
    } else {
      availability = new Availability({
        room_id,
        tanggal,
        jumlah_kamar_tersedia,
        harga_per_malam: finalPrice
      });
    }
    
    await availability.save();
    
    res.status(201).json({
      success: true,
      message: 'Ketersediaan kamar berhasil diperbarui',
      data: availability,
      rateplan_applied: applicableRatePlan ? {
        id: applicableRatePlan._id,
        nama: applicableRatePlan.nama_rateplan
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui ketersediaan kamar',
      error: error.message
    });
  }
};

exports.getAvailabilityByRoomAndDateRange = async (req, res) => {
  try {
    const { room_id } = req.params;
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal mulai dan tanggal selesai wajib diisi'
      });
    }
    
    const availability = await Availability.find({
      room_id,
      tanggal: {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      }
    }).sort({ tanggal: 1 });
    
    res.status(200).json({
      success: true,
      count: availability.length,
      data: availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data ketersediaan kamar',
      error: error.message
    });
  }
};

exports.bulkUploadAvailability = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File CSV tidak ditemukan'
      });
    }
    
    const results = [];
    const errors = [];
    
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          try {
            const { room_id, tanggal, jumlah_kamar_tersedia, harga_per_malam } = row;
            
            if (!room_id || !tanggal || !jumlah_kamar_tersedia) {
              errors.push(`Data tidak lengkap: ${JSON.stringify(row)}`);
              continue;
            }
            
            const room = await Room.findById(room_id);
            if (!room) {
              errors.push(`Kamar dengan ID ${room_id} tidak ditemukan`);
              continue;
            }
            
            const checkDate = new Date(tanggal);
            const dayOfWeek = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'][checkDate.getDay()];
            
            const applicableRatePlan = await RatePlan.findOne({
              room_id,
              periode_mulai: { $lte: checkDate },
              periode_selesai: { $gte: checkDate },
              [`hari_dalam_minggu.${dayOfWeek}`]: true,
              status: 'active'
            }).sort({ prioritas: -1 });
            
            const finalPrice = harga_per_malam || (applicableRatePlan ? applicableRatePlan.harga_dasar : room.harga_default);
            
            let availability = await Availability.findOne({ 
              room_id, 
              tanggal: new Date(tanggal) 
            });
            
            if (availability) {
              availability.jumlah_kamar_tersedia = jumlah_kamar_tersedia;
              availability.harga_per_malam = finalPrice;
            } else {
              availability = new Availability({
                room_id,
                tanggal: new Date(tanggal),
                jumlah_kamar_tersedia,
                harga_per_malam: finalPrice
              });
            }
            
            await availability.save();
          } catch (error) {
            errors.push(`Error pada baris: ${JSON.stringify(row)} - ${error.message}`);
          }
        }
        
        fs.unlinkSync(req.file.path);
        
        res.status(200).json({
          success: true,
          message: `${results.length - errors.length} data berhasil diproses, ${errors.length} data gagal`,
          errors: errors.length > 0 ? errors : undefined
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses file CSV',
      error: error.message
    });
  }
};
