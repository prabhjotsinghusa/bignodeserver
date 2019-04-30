const mongoose = require('mongoose');

require('../models/Cdrs');

const Cdr = mongoose.model('Cdr');

const cdr = {};

cdr.getAll = (req, res, next) => {
    Cdr.find().then(data => {
        res.json({ cdr: data });
    });
}

cdr.add = (req, res, next) => {
    let c = new Cdr();
    c.clid = req.body.clid;
    c.save().then(data => {
        res.json({ data: data });
    });


}

module.exports = cdr;