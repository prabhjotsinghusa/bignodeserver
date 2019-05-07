const mongoose = require('mongoose');

require('../models/Asterisk');

const Asterisk = mongoose.model('Asterisk');

const asterisk = {};

asterisk.add = (req, res, next) => {
    let c = new Asterisk();
    c.data = 'hit by asterisk';
    c.save().then(data => {
        res.json({ data: data });
    });


}

module.exports = asterisk;