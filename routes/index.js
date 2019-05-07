const router = require('express').Router();

router.use(require('./cdrs'));
router.use(require('./asterisk'));

module.exports = router;
