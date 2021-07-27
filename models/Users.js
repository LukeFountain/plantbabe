const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
  },
  twitterId:{
    type: String,
    required: false,
  },
  displayName: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema)
