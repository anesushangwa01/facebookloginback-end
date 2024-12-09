const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: { type: String, required: true },
  name: String,
  email: String,
  photoUrl: String,
});

module.exports = mongoose.model('User', userSchema);
