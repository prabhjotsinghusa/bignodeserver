const mongoose = require('mongoose');

const AsteriskSchema = new mongoose.Schema({
    data:{type:String, defualt:''}
}, { timestamps: true });

module.exports = mongoose.model('Asterisk', AsteriskSchema);
