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






    upload: asyncHandler(async (req, res) => {
        const post = await PostService.upload(req, res);
    }),
    getPosted: asyncHandler(async (req, res) => {
        const post = await PostService.getPosted(req, res);
    }),
    readPostWithQuantity: asyncHandler(async (req, res) => {
        const post = await PostService.readPostWithQuantity(req, res);
    }),
    deletePost: asyncHandler(async (req, res) => {
        const post = await PostService.deletePost(req, res);
    }),
    loadDeletedPost: asyncHandler(async (req, res) => {
        const post = await PostService.loadDeletedPost(req, res);
    }),
    restorePost: asyncHandler(async (req, res) => {
        const post = await PostService.restorePost(req, res);
    }),
    destroyPostById: asyncHandler(async (req, res) => {
        const post = await PostService.destroyPostById(req, res);
    }),
    getPostedById: asyncHandler(async (req, res) => {
        const post = await PostService.getPostedById(req, res);
    }),
    
    getSearchValue: asyncHandler(async (req, res) => {
        const post = await PostService.getSearchValue(req, res);
    }),
    getLandingPost: asyncHandler(async (req, res) => {
        const post = await PostService.getLandingPost(req, res);
    }),
    getSortByCreateDateProst: asyncHandler(async (req, res) => {
        const post = await PostService.sortByCreateDate(req, res);
    }),
    getSortByPriceProst: asyncHandler(async (req, res) => {
        const post = await PostService.sortByPrice(req, res);
    }),
    getFilterValue: asyncHandler(async (req, res) => {
        const { address, area, price, utils, currentPage} = req.body;
        try {
            const result = await PostService.getFilterValue({ address, area, price, utils, currentPage });
            return res.status(200).json({ message: "filter result", data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
    favoritePost: asyncHandler(async (req, res) => {
        const user = await PostService.favoritePost(req, res);
    }),
    getPostedByOwner: asyncHandler(async (req, res) => {
        const user = await PostService.getPostedByOwner(req, res);
    }),
    RemovefavoritePost: asyncHandler(async (req, res) => {
        const user = await PostService.removeFavoritePost(req, res);
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
