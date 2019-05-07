const router = require('express').Router();
const asterisks = require('../controllers/asterisk');

router.get('/asterisk/add',asterisks.add);

module.exports = router;