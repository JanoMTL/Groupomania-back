
const router = require('express').Router();
const authController = require('../controllers/auth');
router.post('/register', authController.signup);

module.exports = router; 