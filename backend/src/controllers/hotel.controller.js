const Hotel = require('../models/hotel.model');

exports.createHotel = async (req, res) => {
  try {
    const { nama_hotel, alamat, kota, deskripsi, fasilitas } = req.body;
    
    const hotel = new Hotel({
      nama_hotel,
      alamat,
      kota,
      deskripsi,
      fasilitas: fasilitas || [],
      foto_cover: req.file ? req.file.filename : 'default-hotel.jpg'
    });
    
    await hotel.save();
    
    res.status(201).json({
      success: true,
      message: 'Hotel berhasil ditambahkan',
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan hotel',
      error: error.message
    });
  }
};

exports.getAllHotels = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role !== 'admin') {
      query = { _id: req.user.hotel_id };
    }
    
    const hotels = await Hotel.find(query);
    
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data hotel',
      error: error.message
    });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data hotel',
      error: error.message
    });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const { nama_hotel, alamat, kota, deskripsi, fasilitas } = req.body;
    
    const updateData = {
      nama_hotel,
      alamat,
      kota,
      deskripsi,
      fasilitas: fasilitas || []
    };
    
    if (req.file) {
      updateData.foto_cover = req.file.filename;
    }
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data hotel berhasil diperbarui',
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui data hotel',
      error: error.message
    });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Hotel berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus hotel',
      error: error.message
    });
  }
};
