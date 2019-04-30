const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),

mongoose = require('mongoose');

mongoose.connect('mongodb://nodeuser:nodeuser@localhost/asteriskcdrdb?authSource=admin', { useNewUrlParser: true });
// mongoose.set('debug', true); 

const app = express();

const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./routes/index'));


app.listen(5000, () =>
    console.log(`Example app listening on port 5000!`),
);