const BankAccount = require('../models/bankAccount.model');

exports.createBankAccount = async (req, res) => {
  try {
    const { hotel_id, nama_bank, nomor_rekening, nama_rekening } = req.body;
    
    const bankAccount = new BankAccount({
      hotel_id,
      nama_bank,
      nomor_rekening,
      nama_rekening
    });
    
    await bankAccount.save();
    
    res.status(201).json({
      success: true,
      message: 'Rekening bank berhasil ditambahkan',
      data: bankAccount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan rekening bank',
      error: error.message
    });
  }
};

exports.getBankAccountsByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    const bankAccounts = await BankAccount.find({ hotel_id: hotelId });
    
    res.status(200).json({
      success: true,
      count: bankAccounts.length,
      data: bankAccounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rekening bank',
      error: error.message
    });
  }
};

exports.getBankAccountById = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findById(req.params.id);
    
    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        message: 'Rekening bank tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: bankAccount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data rekening bank',
      error: error.message
    });
  }
};

exports.updateBankAccount = async (req, res) => {
  try {
    const { nama_bank, nomor_rekening, nama_rekening } = req.body;
    
    const bankAccount = await BankAccount.findByIdAndUpdate(
      req.params.id,
      { nama_bank, nomor_rekening, nama_rekening },
      { new: true, runValidators: true }
    );
    
    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        message: 'Rekening bank tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Rekening bank berhasil diperbarui',
      data: bankAccount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui rekening bank',
      error: error.message
    });
  }
};

exports.deleteBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findByIdAndDelete(req.params.id);
    
    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        message: 'Rekening bank tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Rekening bank berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus rekening bank',
      error: error.message
    });
  }
};
