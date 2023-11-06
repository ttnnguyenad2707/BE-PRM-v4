const router = require('express').Router();
const SecurityController=require("../controllers/security.controller")
const {verifyToken,verifyTokenAdmin}=require("../middlewares/verifyToken.middleware");

router.post('/',SecurityController.createOne)
router.get('/',SecurityController.getAll)


module.exports = router;
