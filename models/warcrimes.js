const mongoose = require('mongoose');
const WarCrimeSchema  = new mongoose.Schema({
  country :{
      type: String,
      required : true
  } ,
  year :{
    type  : Number,
    required : true
  } ,
  description :{
      type : String,
      required: true
  }
});

const WarCrime = mongoose.model('WarCrime',WarCrimeSchema);

module.exports = WarCrime;