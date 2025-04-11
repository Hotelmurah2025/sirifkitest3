const Room = require('../models/room.model');

exports.createRoom = async (req, res) => {
  try {
    const { hotel_id, nama_kamar, tipe_tempat_tidur, fasilitas_kamar, harga_default } = req.body;
    
    const room = new Room({
      hotel_id,
      nama_kamar,
      tipe_tempat_tidur,
      fasilitas_kamar: fasilitas_kamar || [],
      harga_default,
      foto_kamar: req.files ? req.files.map(file => file.filename) : []
    });
    
    await room.save();
    
    res.status(201).json({
      success: true,
      message: 'Kamar berhasil ditambahkan',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan kamar',
      error: error.message
    });
  }
};

exports.getRoomsByHotelId = async (req, res) => {
  try {
    const rooms = await Room.find({ hotel_id: req.params.hotelId });
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kamar',
      error: error.message
    });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kamar',
      error: error.message
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { nama_kamar, tipe_tempat_tidur, fasilitas_kamar, harga_default } = req.body;
    
    const updateData = {
      nama_kamar,
      tipe_tempat_tidur,
      fasilitas_kamar: fasilitas_kamar || [],
      harga_default
    };
    
    if (req.files && req.files.length > 0) {
      updateData.foto_kamar = req.files.map(file => file.filename);
    }
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data kamar berhasil diperbarui',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data kamar',
      error: error.message
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Kamar berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kamar',
      error: error.message
    });
  }
};
