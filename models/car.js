const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: String,
  isFourWheelDrive: Boolean,
});

const Car = mongoose.model("Car", carSchema); // create model

module.exports = Car;
