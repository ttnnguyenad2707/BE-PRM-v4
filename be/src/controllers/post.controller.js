const asyncHandler = require('../utils/async-handler');
const PostService = require("../services/post.service");
const { post } = require('../routes/post.route');


module.exports = {
    
    createOne: asyncHandler(async (req, res) => {
        const post = await PostService.createOne(req, res);
    }),
    getAll:asyncHandler(async (req, res) => {
        const post = await PostService.getAll(req, res);
    }),
    getAllByOwner:asyncHandler(async (req, res) => {
        const post = await PostService.getAllByOwner(req, res);
    }),
    getOne:asyncHandler(async (req, res) => {
        const post = await PostService.getOne(req, res);
    }),
    getOneBySlug: asyncHandler(async (req, res) => {
        const post = await PostService.getOneBySlug(req, res);
    }),
    updateOne: asyncHandler(async (req, res) => {
        const post = await PostService.updateOne(req, res);
    }),
    getAllDeleted: asyncHandler(async (req, res) => {
        const post = await PostService.getAllDeleted(req, res);
    }),
    deleteOne: asyncHandler(async (req, res) => {
        const post = await PostService.deleteOne(req, res);
    }),
    destroyOne: asyncHandler(async (req, res) => {
        const post = await PostService.destroyOne(req, res);
    }),
    restoreOne: asyncHandler(async (req, res) => {
        const post = await PostService.restoreOne(req, res);
    }),
    addCommentToPost: asyncHandler(async (req, res) => {
        await PostService.addCommentToPost(req, res);
    }),
    replyComment: asyncHandler(async (req, res) => {
        await PostService.replyComment(req, res);
    }),
    getCommentOfPost: asyncHandler(async (req, res) => {
        await PostService.getCommentOfPost(req, res);
    }),
    likeComment: asyncHandler(async (req, res) => {
        await PostService.likeComment(req, res);
    }),

};
