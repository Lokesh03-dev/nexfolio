const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    domain: {
      type: String,
      required: true,
      enum: ['frontend', 'backend', 'fullstack', 'devops', 'other'],
      default: 'other'
    },
    isPremium: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

// Pre-save middleware to hash password
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};


userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      { userId: this._id, email: this.email },
      process.env.JWT_SECRET
    )
  } catch (error) {
    return null
  }
}

const User = mongoose.model('User', userSchema)
module.exports = User
