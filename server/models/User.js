const mongoose = require('mongoose');
const { hashPassword, verifyPassword } = require('../utils/auth');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true
    },
    partnerId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['Store Manager', 'Shift Supervisor', 'Barista'],
      default: 'Store Manager'
    },
    storeLocation: {
      type: String,
      default: 'Main Branch',
      trim: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving when modified
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await hashPassword(this.password);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Compare candidate password with hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
  return verifyPassword(candidatePassword, this.password);
};

// Format safe user object for API responses
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    partnerId: this.partnerId,
    email: this.email,
    role: this.role,
    storeLocation: this.storeLocation,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
