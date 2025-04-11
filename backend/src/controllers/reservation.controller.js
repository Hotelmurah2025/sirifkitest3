const Reservation = require('../models/reservation.model');
const Room = require('../models/room.model');
const Availability = require('../models/availability.model');

exports.createReservation = async (req, res) => {
  try {
    const { hotel_id, room_id, nama_tamu, check_in, check_out, jumlah_tamu, catatan } = req.body;
    
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    if (room.hotel_id.toString() !== hotel_id) {
      return res.status(400).json({
        success: false,
        message: 'Kamar tidak tersedia di hotel ini'
      });
    }
    
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal check-out harus setelah tanggal check-in'
      });
    }
    
    const dates = [];
    const currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    for (const date of dates) {
      const availability = await Availability.findOne({
        room_id,
        tanggal: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        }
      });
      
      if (!availability || availability.jumlah_kamar_tersedia <= 0) {
        return res.status(400).json({
          success: false,
          message: `Kamar tidak tersedia pada tanggal ${date.toISOString().split('T')[0]}`
        });
      }
    }
    
    const reservation = new Reservation({
      hotel_id,
      room_id,
      user_id: req.user._id,
      nama_tamu,
      check_in: checkInDate,
      check_out: checkOutDate,
      jumlah_tamu,
      status: 'pending',
      catatan
    });
    
    await reservation.save();
    
    for (const date of dates) {
      const availability = await Availability.findOne({
        room_id,
        tanggal: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        }
      });
      
      if (availability) {
        availability.jumlah_kamar_tersedia -= 1;
        await availability.save();
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Reservasi berhasil dibuat',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat reservasi',
      error: error.message
    });
  }
};

exports.getReservationsByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status } = req.query;
    
    const query = { hotel_id: hotelId };
    
    if (status) {
      query.status = status;
    }
    
    const reservations = await Reservation.find(query)
      .populate('room_id', 'nama_kamar tipe_tempat_tidur')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data reservasi',
      error: error.message
    });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('room_id', 'nama_kamar tipe_tempat_tidur harga_default')
      .populate('hotel_id', 'nama_hotel alamat kota');
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservasi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data reservasi',
      error: error.message
    });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservasi tidak ditemukan'
      });
    }
    
    if (status === 'cancelled') {
      const checkInDate = new Date(reservation.check_in);
      const checkOutDate = new Date(reservation.check_out);
      
      const dates = [];
      const currentDate = new Date(checkInDate);
      while (currentDate < checkOutDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      for (const date of dates) {
        const availability = await Availability.findOne({
          room_id: reservation.room_id,
          tanggal: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999))
          }
        });
        
        if (availability) {
          availability.jumlah_kamar_tersedia += 1;
          await availability.save();
        }
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Status reservasi berhasil diperbarui',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status reservasi',
      error: error.message
    });
  }
};
