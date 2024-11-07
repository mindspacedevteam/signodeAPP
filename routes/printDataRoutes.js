// routes/printDataRoutes.js
const express = require('express');
const { printData } = require('../controllers/printDataController');

const router = express.Router();

router.post('/printData', printData);

module.exports = router;
