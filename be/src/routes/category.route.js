const router = require('express').Router();
const CategoryController=require("../controllers/category.controller")
const {verifyToken,verifyTokenAdmin}=require("../middlewares/verifyToken.middleware");

router.post('/',CategoryController.createOne)
router.get('/',CategoryController.getAll)


module.exports = router;
