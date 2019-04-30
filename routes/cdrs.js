const router = require('express').Router();
const cdrs = require('../controllers/cdrs');

router.get('/cdr/get',cdrs.getAll);
router.post('/cdr/add',cdrs.add);

module.exports = router;