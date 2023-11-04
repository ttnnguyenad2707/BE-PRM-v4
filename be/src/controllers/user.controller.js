const asyncHandler = require('../utils/async-handler');
const UserService = require("../services/user.service");


module.exports = {

    getOne: asyncHandler(async (req, res) => {
        const user = await UserService.getOne(req, res);
    }),

    addOneFavorite: asyncHandler(async (req, res) => {
        const user = await UserService.addOneFavorite(req, res);
    }),
    deleteOneInFavorite: asyncHandler(async (req, res) => {
        const user = await UserService.deleteOneInFavorite(req, res);
    }),

    getFavorite: asyncHandler(async (req, res) => {
        const user = await UserService.getFavorite(req, res);
    }),


    updateOne: asyncHandler(async (req, res) => {
        const user = await UserService.updateOne(req, res);
    }),
    updateOneForAdmin: asyncHandler(async (req, res) => {
        const user = await UserService.updateUserForAdmin(req, res);
    }),

    getUserlist: asyncHandler(async (req, res) => {
        const listUsers = await UserService.getUserlist(req, res);
    }),
    upDateRole: asyncHandler(async(res,req)=>{
        const user = await UserService.updateRole(res,req);
    }),
    decreseRole: asyncHandler(async(res,req)=>{
        const user = await UserService.decreseRole(res,req);
    }),
    blockUser: asyncHandler(async(res,req)=>{
        const user = await UserService.blockUser(res,req);
    }),
    openUser: asyncHandler(async(res,req)=>{
        const user = await UserService.openUser(res,req);
    }),
    changePassword: asyncHandler(async(res,req)=>{
        const user = await UserService.changePassword(res,req);
    }),


};
