const router = require('express').Router();
const PostController = require("../controllers/post.controller")
const { validatePOST, validatePUT } = require('../validations/post.validate');
const { verifyToken, } = require("../middlewares/verifyToken.middleware");


router.get('/:id', verifyToken, PostController.getOne);
router.get('/', PostController.getAll);
router.get('/owner/:owner', PostController.getAllByOwner);
router.post('/', verifyToken, PostController.createOne);
router.put('/:id', verifyToken, PostController.updateOne);
router.get('/slug/:slug', PostController.getOneBySlug);
router.get('/deleted/:owner', verifyToken,PostController.getAllDeleted);
router.delete('/:id', verifyToken, PostController.deleteOne);
router.delete('/destroy/:id', verifyToken, PostController.destroyOne)
router.put('/rs/:id', verifyToken, PostController.restoreOne);
router.post('/comment/:commentId/reply',verifyToken,PostController.replyComment)
router.post('/:postId/comment',verifyToken,PostController.addCommentToPost);
router.get('/:postId/comment',PostController.getCommentOfPost)
router.put('/comment/like',verifyToken,PostController.likeComment)
router.get('/:owner/block',verifyToken,PostController.getAllBock)



module.exports = router;
