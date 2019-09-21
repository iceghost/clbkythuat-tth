const express = require('express');

const router = express.Router();

// Adds support for GET requests to our webhook
router.get('/', require('./verify-webhook'));

// Creates the endpoint for our webhook 
router.post('/', require('./reply-message'));

module.exports = router;