const mongoose = require("mongoose");


// changing this from title to plant Name 
const PlantSchema = new mongoose.Schema({
  plantName: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
  },
  imageurl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('plants', PlantSchema)
