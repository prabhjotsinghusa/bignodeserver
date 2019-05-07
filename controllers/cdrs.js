const mongoose = require('mongoose');

require('../models/Cdrs');
require('../models/Tfn');

const Cdr = mongoose.model('Cdr');
const Tfn = mongoose.model('Tfn');

const cdr = {};

cdr.getAll = (req, res, next) => {
    Cdr.find().then(data => {
        res.json({ cdr: data });
    });
}

cdr.add = async (req, res, next) => {
    const getTfndetails = (tfn) => {
        let str = { tfn: tfn };
        const aggregateObj = [
            {
                $match: str
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'pub_id',
                    foreignField: 'uid',
                    as: 'userdata'
                }
            },
            {
                $lookup: {
                    from: 'camp_pub_tfns',
                    localField: 'tfn',
                    foreignField: 'tfn',
                    as: 'camp_pub_data'
                }
            },
            { '$lookup': { from: 'campaigns', localField: 'camp_pub_data.camp_id', foreignField: 'campaign_id', as: 'campaigndata' } },
            {
                $unwind: "$camp_pub_data"
            },
            {
                $lookup: {
                    from: 'camp_buyer_tfns',
                    localField: 'camp_pub_data.camp_id',
                    foreignField: 'camp_id',
                    as: 'camp_buyer_data'
                }
            },
            {
                $lookup: {
                    from: 'user_settings',
                    localField: 'pub_id',
                    foreignField: 'pub_id',
                    as: 'user_settings'
                }
            },
            {
                $project:
                {
                    tfn: 1,
                    pub_id: 1,
                    status: 1,
                    //"price_per_tfn": 1,
                    charge_per_minute: 1,
                    publisherName: { $arrayElemAt: ["$userdata.fullname", 0] },
                    publisherSettings: { $arrayElemAt: ["$user_settings", 0] },
                    pub_price_per_tfn: { $arrayElemAt: ["$userdata.price_per_tfn", 0] },
                    camp_id: "$camp_pub_data.camp_id",
                    buyerData: "$camp_buyer_data",
                    campaigndata: { '$arrayElemAt': ['$campaigndata', 0] }
                }

            }
        ];


        return new Promise((resolve, reject) => {
            Tfn.aggregate(aggregateObj).then(data => {
                if (!data) {
                    reject(null);
                }
                resolve(data[0]);
            }).catch((err) => {
                reject(err);
            });
        })
    }

    const tfndetails = await getTfndetails(req.body.did);
    console.log(req.body);
    let c = new Cdr();
    c.ip = req.connection.remoteAddress || '';
    c.clid = req.body.clid;
    c.start = req.body.start;
    c.answer = req.body.answer;
    c.end = req.body.end;
    c.clid = req.body.clid;
    c.src = req.body.src;
    c.dst = req.body.dst;
    c.dcontext = req.body.dcontext;
    c.channel = req.body.channel;
    c.dstchannel = req.body.dstchannel;
    c.lastapp = req.body.lastapp;
    c.lastdata = req.body.lastdata;
    c.duration = req.body.duration;
    c.billsec = req.body.billsec;
    c.disposition = req.body.disposition;
    c.amaflags = req.body.amaflags;
    c.accountcode = req.body.accountcode;
    c.uniqueid = req.body.uniqueid;
    //c.userfield= req.body.userfield;
    c.did = req.body.did;
    c.recordingfile = req.body.recordingfile || '';
    c.cnum = req.body.cnum;
    c.pub_id = 0;
    c.camp_id = 0;
    c.buyer_id = req.body.dst;
    c.price_per_tfn=0;
    c.call_reducer=0;
    c.count=0;
    c.status='show';
    c.click_id=0,    
    c.charge_per_minute=0;
    c.wallet = 0;
    c.wallet_status='no';
    c.buffer_time=0;

    if(tfndetails !== undefined){
        c.pub_id = tfndetails.pub_id;
        c.camp_id = tfndetails.camp_id;
        c.buyer_id = req.body.dst;
        c.price_per_tfn=tfndetails.campaigndata.price_per_call;
    /*     call_reducer: { type: Number,default: null },
        count: { type: Number,default: null },
        status: { type: String,default: null },
        click_id: { type: String,default: null },
         */
        if(tfndetails.publisherSettings.charge_per_minute){
            c.charge_per_minute=tfndetails.charge_per_minute;
            c.wallet = Math.ceil(parseInt(req.body.duration)/60)*tfndetails.charge_per_minute;
            c.wallet_status='yes';
        }else {
            c.wallet = tfndetails.campaigndata.price_per_call;
            c.wallet_status='no';
        }
        c.buffer_time=tfndetails.campaigndata.buffer_time;
    }   
    //c.cnam= req.body.cnam;
    //c.outbound_cnum= req.body.outbound_cnum;
    //c.outbound_cnam= req.body.outbound_cnam;
    //c.dst_cnam= req.body.dst_cnam;




    c.save().then(data => {
        if(data){
            res.json({ success:'OK' });
        }
        
    });
   //res.json({ success: c});
    
}

module.exports = cdr;