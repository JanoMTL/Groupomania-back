
const router = require('express').Router();
const multer = require('../middlewares/multer-config');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const validate =require('../middlewares/validate');

router.post("/signup", validate, userCtrl.signUp);
router.post("/login", userCtrl.login);
router.get("/profile/:id", auth, userCtrl.getOneProfile);
router.get("/profile", auth, userCtrl.getAllProfile);
router.put("/profile/:id", auth, multer, userCtrl.updateProfile);
router.delete("/profile/:id", auth, userCtrl.deleteProfile);



module.exports = router; 