const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const emailService = require('../services/emailService');

router.post('/send', emailController.sendEmail);

module.exports = router;
