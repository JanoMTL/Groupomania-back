
const router = require('express').Router();
const multer = require('../middlewares/multer-config')
const userCtrl = require('../controllers/user');

router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.login);
router.get("/profile/:id", userCtrl.getOneProfile);
router.get("/profile", userCtrl.getAllProfile);
router.put("/profile/:id", multer, userCtrl.updateProfile);
router.delete("/profile/:id", userCtrl.deleteProfile);



module.exports = router; 