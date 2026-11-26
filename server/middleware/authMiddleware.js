const User = require('../models/User');
const { verifyToken } = require('../utils/auth');

/**
 * Express middleware that requires a valid Bearer JWT token.
 */
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in to access the inventory.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Partner account no longer exists. Please log in again.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired session. Please log in again.'
    });
  }
};
