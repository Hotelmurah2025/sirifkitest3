const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Akses ditolak. Token tidak ditemukan.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'extranet-hotel-secret-key');
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Pengguna tidak ditemukan.' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token tidak valid.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token telah kedaluwarsa. Silakan login kembali.' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan saat verifikasi token.', 
      error: error.message 
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Akses ditolak. Anda tidak memiliki hak akses admin.' 
    });
  }
  next();
};

exports.isOwner = (req, res, next) => {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Akses ditolak. Anda tidak memiliki hak akses pemilik hotel.' 
    });
  }
  next();
};

exports.hasHotelAccess = (req, res, next) => {
  const hotelId = req.params.hotelId || req.body.hotel_id;
  
  if (req.user.role === 'admin') {
    return next();
  }
  
  if ((req.user.role === 'owner' || req.user.role === 'staff') && 
      req.user.hotel_id && 
      req.user.hotel_id.toString() === hotelId) {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Akses ditolak. Anda tidak memiliki akses ke hotel ini.' 
  });
};
