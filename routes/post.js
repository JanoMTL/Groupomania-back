const router = require('express').Router();
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post')
const likeCtrl = require('../controllers/like')


router.get("/", postCtrl.getAll);
router.get("/:id", postCtrl.getOne);
router.post("/create",postCtrl.createOne);
router.put("/:id", postCtrl.updateOne);
router.post("/:id/like", likeCtrl.likeOne);
router.delete("/:id", postCtrl.deleteOne);





module.exports = router;