
const router = require('express').Router();

const userCtrl = require('../controllers/user');

router.post("/signup", userCtrl.signUp);

module.exports = router; 