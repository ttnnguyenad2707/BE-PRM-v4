// @ts-ignore
const User = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { ACCESS_KEY } = process.env;

class UserService {
    async getOne(req, res) {
        const { userId } = req.params;
        const token = req.headers.token;
        try {
            const accessToken = token.split(" ")[1];
            const user = jwt.verify(accessToken, ACCESS_KEY);
            if (userId === user.id) {
                const result = await User.findById(userId)
                    .populate('favorites');
                const { password, refreshToken, admin, ...other } = result._doc;
                return res.status(200).json({ ...other });
            }
            const result = await User.findById(userId);
            const { password, refreshToken, admin, ...other } = result;
            return res.status(200).json({ ...other });
        } catch (error) {
            return res.status(500).json({ "error": error.message });
        }
    }
    async addOneFavorite(req, res) {
        const { id } = req.params;
        const { owner } = req.body;
        try {
            const result = await User.findByIdAndUpdate(owner, { $push: { favorites: id } })
            return res.status(200).json("Add successfully")

        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async deleteOneInFavorite(req, res) {
        const { id } = req.params;
        const { owner } = req.body;
        try {
            const result = await User.findByIdAndUpdate(owner, { $pull: { favorites: id } })
            return res.status(200).json("Removed successfully")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async getFavorite(req,res){
        const {userId} = req.params;
        try {
            const result = await User.findById(userId).populate('favorites');
            return res.status(200).json(result.favorites);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    // async updateOne(req, res) {
    //     try {
    //         const result= await User.findByIdAndUpdate({_id:req.params.id},{...req.body});
    //         return res.status(200).json({"message":"Update successfully","data":{...result._doc,password:"not show"}});

    //     } catch (error) {
    //         return res.status(500).json({"error":error.message});
    //     }
    // }
    async updateOne(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { ...req.body });
            const updatedUserData = await User.findById(req.params.id);

            return res.status(200).json({ "message": "Update successfully", "data": { ...updatedUserData._doc, password: "not show" } });
        } catch (error) {
            return res.status(500).json({ "error": error.message });
        }
    }

    async updateUserForAdmin(req, res) {
        try {
            const idUser = req.params.id;
            const findUser = User.find({ _id: idUser });
            if (!findUser) return res.status(404).json("Not found User");
            if (findUser.status === true) {
                const result = await User.findByIdAndUpdate({ _id: idUser }, { status: false })
                return res.status(200).json("Update Successfully");
            }
            if (findUser.status === false) {
                const result = await User.findByIdAndUpdate({ _id: idUser }, { status: true });
                return res.status(200).json("Update Successfully");
            }

        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    // get user list (admin page)
    async getUserlist(req, res) {
        try {
            const dataSize = await User.find()
            const currentPage = parseInt(req.params.currentPage);
            const perPage = 10;
            const totalPages = Math.ceil(dataSize.length / perPage);
            const skip = (currentPage - 1) * perPage;
            const result = await User.find().skip(skip)
                .limit(perPage).exec();;
            return res.status(201).json({ "message": "get all user successfully", "data": result, totalPage: totalPages });
        } catch (error) {
            return res.status(501).json({ "error": error.message });
        }
    }
    async updateRole(req, res) {
        const Id = req.params.id;
        try {
            const result = await User.findByIdAndUpdate({ _id: Id }, { admin: true });
            return res.status(202).json(
                {
                    "message": "Update successfully",
                    "data": await User.find({ _id: Id })
                })
        } catch (error) {
            return res.status(502).json({ "error": error.message });
        }
    }

    async decreseRole(req, res) {
        const Id = req.params.id;
        try {
            const result = await User.findByIdAndUpdate({ _id: Id }, { admin: false });
            return res.status(202).json(
                {
                    "message": "Update successfully",
                    "data": await User.find({ _id: Id })
                })
        } catch (error) {
            return res.status(502).json({ "error": error.message });
        }
    }

    async blockUser(req, res) {
        const Id = req.params.id;
        try {
            const result = await User.findByIdAndUpdate({ _id: Id }, { status: false });
            return res.status(202).json(
                {
                    "message": "block user successfully",
                    "data": await User.find({ _id: Id })
                })
        } catch (error) {
            return res.status(502).json({ "error": error.message });
        }
    }

    async openUser(req, res) {
        const Id = req.params.id;
        try {
            const result = await User.findByIdAndUpdate({ _id: Id }, { status: true });
            return res.status(202).json(
                {
                    "message": "open user successfully",
                    "data": await User.find({ _id: Id })
                })
        } catch (error) {
            return res.status(502).json({ "error": error.message });
        }
    }
    async changePassword(req, res) {
        const Id = req.params.id;
        const { newPassword, confirmPassword } = req.body;
        try {
            // const result= await User.findByIdAndUpdate({_id: Id}, {status: true});
            const findUser = await User.findOne({ _id: Id });
            // console.log("user : =>>", findUser);
            const comparePassword = await bcrypt.compare(req.body.password, findUser.password);
            if (!comparePassword) {
                return res.status(401).json({ error: "Mật khẩu hiện tại không chính xác" });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "Mật khẩu mới và mật khẩu xác nhận không trùng nhau" });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // console.log("hashedPassword ",hashedPassword );
            await User.findByIdAndUpdate({ _id: Id }, { password: hashedPassword });
            return res.status(202).json(
                {
                    "message": "mật khẩu đã được cập nhật thành công ! vui lòng đăng nhập lại",
                    // "data": await User.find({ _id: Id })
                })
        } catch (error) {
            return res.status(502).json({ "error": error.message });

        }
    }
}

module.exports = new UserService();
