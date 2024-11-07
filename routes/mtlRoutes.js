const express = require('express');
const { updateMTLStatus } = require('../controllers/mtlController');
const router = express.Router();

router.post('/update-mtl-status', updateMTLStatus);

module.exports = router;
