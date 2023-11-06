const router = require('express').Router();
const InteriorController=require("../controllers/interior.controller")
const {verifyToken,verifyTokenAdmin}=require("../middlewares/verifyToken.middleware");

router.post('/',InteriorController.createOne)
router.get('/',InteriorController.getAll)


module.exports = router;
