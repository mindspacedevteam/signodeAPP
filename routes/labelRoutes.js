// routes/labelRoutes.js
const express = require("express");
const { createPrimaryLabel, createSecondaryLabel, createTertiaryLabel } = require("../controllers/labelController");

const router = express.Router();

// Route for creating a primary label type
router.post("/createPrimaryLabel", createPrimaryLabel);

// Route for creating a secondary label type
router.post("/createSecondaryLabel", createSecondaryLabel);

// Route for creating a tertiary label type
router.post("/createTertiaryLabel", createTertiaryLabel);

module.exports = router;
