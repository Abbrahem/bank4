const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' } // رابط صورة البروفايل (اختياري)
});

module.exports = mongoose.model('User', userSchema); 