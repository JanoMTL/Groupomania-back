
const router = require('express').Router();

const userCtrl = require('../controllers/user');

router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.login);



module.exports = router; 