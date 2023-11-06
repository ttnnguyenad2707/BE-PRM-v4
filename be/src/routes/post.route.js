const router = require('express').Router();
const PostController = require("../controllers/post.controller")


router.get('/:id', PostController.getOne);
router.get('/', PostController.getAll);
router.get('/owner/:owner', PostController.getAllByOwner);
router.post('/', PostController.createOne);
router.put('/:id', PostController.updateOne);
router.get('/slug/:slug', PostController.getOneBySlug);
router.get('/deleted/:owner', PostController.getAllDeleted);
router.delete('/:id', PostController.deleteOne);
router.delete('/destroy/:id', PostController.destroyOne)
router.put('/rs/:id', PostController.restoreOne);
router.post('/comment/:commentId/reply', PostController.replyComment)
router.post('/:postId/comment', PostController.addCommentToPost);
router.get('/:postId/comment', PostController.getCommentOfPost)
router.put('/comment/like', PostController.likeComment)
router.get('/:owner/block', PostController.getAllBock)



module.exports = router;
