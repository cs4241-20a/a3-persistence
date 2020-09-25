const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema({
  miles: {
    type: Number,
    required: true
  },
  mph: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: false,
    default: "",
  },
  caloriesBurnt: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const Run = mongoose.model("Run", RunSchema);

module.exports = Run;