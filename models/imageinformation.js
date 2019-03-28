const mongoose = require('mongoose');

const imageinformationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  time: String,
  category: String,
  title: String,
  details: String,
  coordinates: {
    lat: String,
    lng: String
  },
  thumbnail: String,
  image: String,
  original: String
});

module.exports = mongoose.model('Imageinformation',imageinformationSchema);
