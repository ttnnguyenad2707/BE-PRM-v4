const router = require('express').Router();
const UserController=require("../controllers/user.controller")
const {validatePUT, validatePUTChangePassword}=require('../validations/user.validate');
const {verifyToken,verifyTokenAdmin}=require("../middlewares/verifyToken.middleware");

router.get('/favorites/:userId',UserController.getFavorite)
router.get('/:userId',UserController.getOne)
router.put('/favorites/:id', UserController.addOneFavorite);
router.put('/favorites/rm/:id', UserController.deleteOneInFavorite);




router.get('/getlistusers/:currentPage',verifyTokenAdmin,UserController.getUserlist);
router.put('/:id',validatePUT, UserController.updateOne);
router.put('/role/:id',verifyTokenAdmin, UserController.updateOneForAdmin);
router.put('/upRole/:id',verifyTokenAdmin, UserController.upDateRole);
router.put('/decreseRole/:id',verifyTokenAdmin, UserController.decreseRole);
router.put('/blockUser/:id',verifyTokenAdmin, UserController.blockUser);
router.put('/openUser/:id',verifyTokenAdmin, UserController.openUser);

router.put('/:id' ,UserController.updateOne);
router.put('/changePassword/:id', UserController.changePassword);


module.exports = router;
