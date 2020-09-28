const mongoose  = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },password: {
    type: String,
    required: true
  }});

UserSchema.methods.authenticate = function(password) {      
  return this.password === password;
}

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User', UserSchema);
