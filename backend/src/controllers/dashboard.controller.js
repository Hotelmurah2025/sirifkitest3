const Reservation = require('../models/reservation.model');
const Transaction = require('../models/transaction.model');
const Room = require('../models/room.model');

exports.getStats = async (req, res) => {
  try {
    const { hotel_id } = req.query;
    
    const filter = hotel_id ? { hotel_id } : {};
    
    const totalReservations = await Reservation.countDocuments(filter);
    
    const pendingReservations = await Reservation.countDocuments({ 
      ...filter, 
      status: 'pending' 
    });
    
    const confirmedReservations = await Reservation.countDocuments({ 
      ...filter, 
      status: 'confirmed' 
    });
    
    const cancelledReservations = await Reservation.countDocuments({ 
      ...filter, 
      status: 'cancelled' 
    });
    
    const occupancyRate = Math.round(confirmedReservations / (totalReservations || 1) * 100);
    
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const monthlyTransactions = await Transaction.find({
      ...filter,
      status_pembayaran: 'paid',
      createdAt: { $gte: firstDayOfMonth }
    });
    
    const monthlyRevenue = monthlyTransactions.reduce((total, transaction) => {
      return total + (transaction.jumlah_total || 0);
    }, 0);
    
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      
      const monthName = month.toLocaleString('id-ID', { month: 'short' });
      
      const monthTransactions = await Transaction.find({
        ...filter,
        status_pembayaran: 'paid',
        createdAt: { $gte: month, $lte: monthEnd }
      });
      
      const revenue = monthTransactions.reduce((total, transaction) => {
        return total + (transaction.jumlah_total || 0);
      }, 0);
      
      const monthReservations = await Reservation.countDocuments({
        ...filter,
        createdAt: { $gte: month, $lte: monthEnd }
      });
      
      const confirmedMonthReservations = await Reservation.countDocuments({
        ...filter,
        status: 'confirmed',
        createdAt: { $gte: month, $lte: monthEnd }
      });
      
      const occupancy = Math.round(confirmedMonthReservations / (monthReservations || 1) * 100);
      
      monthlyStats.push({
        month: monthName,
        revenue,
        occupancy
      });
    }
    
    const recentReservations = await Reservation.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('room_id', 'nama_kamar');
    
    const formattedRecentReservations = recentReservations.map(reservation => ({
      id: reservation._id,
      guest: reservation.nama_tamu,
      checkIn: new Date(reservation.check_in).toLocaleDateString('id-ID'),
      checkOut: new Date(reservation.check_out).toLocaleDateString('id-ID'),
      room: reservation.room_id ? reservation.room_id.nama_kamar : 'Tidak diketahui',
      status: reservation.status
    }));
    
    res.status(200).json({
      success: true,
      data: {
        totalReservations,
        pendingReservations,
        confirmedReservations,
        cancelledReservations,
        occupancyRate,
        monthlyRevenue,
        monthlyStats,
        recentReservations: formattedRecentReservations
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data dashboard',
      error: error.message
    });
  }
};
