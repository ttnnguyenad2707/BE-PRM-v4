const router = require('express').Router();
const AuthController=require("../controllers/auth.controller")
const {validatePOST}=require('../validations/user.validate');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logoutUser);
router.post('/check-user', AuthController.checkUser);

module.exports = router;
