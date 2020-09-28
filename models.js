const mongoose = require('mongoose');

// Mongoose models

const userSchema = mongoose.Schema({
    username: {type: String},
    password: {type: String}
}, {versionKey: false});
const userModel = mongoose.model('User', userSchema, 'users');

const dataSchema = mongoose.Schema({
    name: {type: String, required: true},
    ps: {type: Number, required: true},
    ms: {type: Number, required: true},
    ss: {type: Number, required: true},
    es: {type: Number, required: true},
    date: {type: String, required: true},
    belongs: {type: String, required: true}
}, {versionKey: false});
const dataModel = mongoose.model('Data', dataSchema, 'data');

module.exports = {
    User: userModel,
    Data: dataModel
};
