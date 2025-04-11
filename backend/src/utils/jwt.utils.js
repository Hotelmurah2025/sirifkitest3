const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role,
      hotel_id: user.hotel_id
    },
    process.env.JWT_SECRET || 'extranet-hotel-secret-key',
    { expiresIn: '24h' }
  );
};
