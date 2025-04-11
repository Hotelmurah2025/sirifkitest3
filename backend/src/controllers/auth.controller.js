const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.utils');

exports.register = async (req, res) => {
  try {
    const { nama, email, password, role, hotel_id } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain.'
      });
    }

    if (!['admin', 'owner', 'staff'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid. Pilih admin, owner, atau staff.'
      });
    }

    if ((role === 'owner' || role === 'staff') && !hotel_id) {
      return res.status(400).json({
        success: false,
        message: 'ID Hotel wajib diisi untuk role owner atau staff.'
      });
    }

    const user = new User({
      nama,
      email,
      password,
      role,
      hotel_id: (role === 'owner' || role === 'staff') ? hotel_id : undefined
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: {
          id: user._id,
          nama: user.nama,
          email: user.email,
          role: user.role,
          hotel_id: user.hotel_id
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: user._id,
          nama: user.nama,
          email: user.email,
          role: user.role,
          hotel_id: user.hotel_id
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login',
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil profil',
      error: error.message
    });
  }
};
