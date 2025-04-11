const Transaction = require('../models/transaction.model');
const Reservation = require('../models/reservation.model');

exports.createTransaction = async (req, res) => {
  try {
    const { hotel_id, reservation_id, jumlah_total, status_pembayaran, metode_pembayaran } = req.body;
    
    const reservation = await Reservation.findById(reservation_id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservasi tidak ditemukan'
      });
    }
    
    if (reservation.hotel_id.toString() !== hotel_id) {
      return res.status(400).json({
        success: false,
        message: 'ID Hotel tidak sesuai dengan reservasi'
      });
    }
    
    const transaction = new Transaction({
      hotel_id,
      reservation_id,
      jumlah_total,
      status_pembayaran: status_pembayaran || 'pending',
      metode_pembayaran,
      tanggal_pembayaran: status_pembayaran === 'paid' ? new Date() : undefined,
      bukti_pembayaran: req.file ? req.file.filename : undefined
    });
    
    await transaction.save();
    
    if (status_pembayaran === 'paid' && reservation.status === 'pending') {
      reservation.status = 'confirmed';
      await reservation.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat transaksi',
      error: error.message
    });
  }
};

exports.getTransactionsByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status, startDate, endDate } = req.query;
    
    const query = { hotel_id: hotelId };
    
    if (status) {
      query.status_pembayaran = status;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const transactions = await Transaction.find(query)
      .populate('reservation_id', 'nama_tamu check_in check_out')
      .sort({ createdAt: -1 });
    
    const totalAmount = transactions.reduce((total, transaction) => {
      if (transaction.status_pembayaran === 'paid') {
        return total + transaction.jumlah_total;
      }
      return total;
    }, 0);
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      totalAmount,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data transaksi',
      error: error.message
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('reservation_id', 'nama_tamu check_in check_out jumlah_tamu')
      .populate({
        path: 'reservation_id',
        populate: {
          path: 'room_id',
          select: 'nama_kamar tipe_tempat_tidur harga_default'
        }
      });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data transaksi',
      error: error.message
    });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status_pembayaran } = req.body;
    
    if (!['pending', 'paid', 'cancelled', 'refunded'].includes(status_pembayaran)) {
      return res.status(400).json({
        success: false,
        message: 'Status pembayaran tidak valid'
      });
    }
    
    const updateData = {
      status_pembayaran
    };
    
    if (status_pembayaran === 'paid') {
      updateData.tanggal_pembayaran = new Date();
    }
    
    if (req.file) {
      updateData.bukti_pembayaran = req.file.filename;
    }
    
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }
    
    if (status_pembayaran === 'paid') {
      const reservation = await Reservation.findById(transaction.reservation_id);
      if (reservation && reservation.status === 'pending') {
        reservation.status = 'confirmed';
        await reservation.save();
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Status transaksi berhasil diperbarui',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui status transaksi',
      error: error.message
    });
  }
};

exports.generateMonthlyInvoice = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Bulan dan tahun wajib diisi'
      });
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const transactions = await Transaction.find({
      hotel_id: hotelId,
      status_pembayaran: 'paid',
      tanggal_pembayaran: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('reservation_id', 'nama_tamu check_in check_out');
    
    const totalAmount = transactions.reduce((total, transaction) => {
      return total + transaction.jumlah_total;
    }, 0);
    
    const invoice = {
      hotel_id: hotelId,
      periode: `${month}/${year}`,
      tanggal_mulai: startDate,
      tanggal_selesai: endDate,
      jumlah_transaksi: transactions.length,
      total_pendapatan: totalAmount,
      detail_transaksi: transactions
    };
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat laporan invoice',
      error: error.message
    });
  }
};
