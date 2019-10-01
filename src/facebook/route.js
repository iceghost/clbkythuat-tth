const express = require('express');

const router = express.Router();

router.get('/', require('./verify-webhook'));
router.post('/', require('./reply-message'));

module.exports = router;
