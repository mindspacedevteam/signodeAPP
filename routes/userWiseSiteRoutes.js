const express = require('express');
const { getUserWiseSite } = require('../controllers/userWiseSiteController');

const router = express.Router();

// Define the route to get user wise sites
router.post('/userWiseSite/:userId', getUserWiseSite);

module.exports = router;
