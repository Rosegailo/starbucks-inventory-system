const User = require('../models/User');
const { signToken } = require('../utils/auth');

// @desc    Log in using static branch User ID (or email) and password
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { identifier, partnerId, userId, email, password } = req.body;
    const loginValue = (identifier || partnerId || userId || email || '').trim();

    if (!loginValue || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your User ID and password.'
      });
    }

    const user = await User.findOne({
      $or: [
        { partnerId: loginValue },
        { partnerId: loginValue.toUpperCase() },
        { email: loginValue.toLowerCase() }
      ]
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User ID or password.'
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken({
      id: user._id.toString(),
      partnerId: user.partnerId,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get currently authenticated partner profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toPublicJSON()
  });
};
