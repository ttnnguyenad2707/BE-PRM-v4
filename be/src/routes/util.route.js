const router = require('express').Router();
const UtilController = require("../controllers/util.controller")
const { verifyToken, verifyTokenAdmin } = require("../middlewares/verifyToken.middleware");

router.post('/', UtilController.createOne)
router.get('/', UtilController.getAll)


module.exports = router;
