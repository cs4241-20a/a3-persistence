const mongoose = require('mongoose');

const GrocerySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    required: true
  },
});

const Grocery = mongoose.model('Grocery', GrocerySchema);

module.exports = Grocery;