// @ts-ignore
const Post = require('../models/post.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');


class PostService {


    async createOne(req, res) {
        const { owner } = req.body;
        const findUser = await User.findById({ _id: owner });
        if (!findUser) return res.status(404).json("Not found User");
        if (!findUser.isVip) {
            const getAllPost = await Post.countDocuments({ owner: owner });
            if (getAllPost >= 10) return res.status(400).json("Upgrade to VIP to post new articles");
            const result = await Post.create({ ...req.body });
            return res.status(200).json(result)
        }
        const result = await Post.create({ ...req.body });
        return res.status(200).json(result)
    }

    async getAll(req, res) {
        let { page, search, address, area, minPrice, maxPrice, utils } = req.query;
        console.log(page, search, address, area, minPrice, maxPrice, utils);
        const limit = 10;

        page = page ? parseInt(page) : 1;
        search = search ? search : '';

        const query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (address) {
            query.address = { $regex: address, $options: 'i' };
        }
        if (area) {
            query.area = { $regex: area, $options: 'i' };
        }
        if (minPrice && maxPrice) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) {
            query.price = { $gte: minPrice };
        } else if (maxPrice) {
            query.price = { $lte: maxPrice };
        }
        if (utils) {
            query.utils = { $in: [utils] };
        }

        const options = {
            page,
            limit,
        };

        try {
            const posts = await Post.find(query,{deleted:false})
                .populate('categories')
                .populate('security')
                .populate('utils')
                .populate('interiors')
                .skip((options.page - 1) * options.limit)
                .limit(options.limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await Post.countDocuments(query);
            const totalPages = Math.ceil(count / options.limit);

            const data = {
                posts,
                page: options.page,
                totalPages: totalPages,
                totalPosts: count,
            };
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Server Error' });
        }
    }
    async getAllByOwner(req, res) {
        const { owner } = req.params;
        try {
            const results = await Post.find({ owner: owner, deleted: false })
                .populate('categories')
                .populate('security')
                .populate('utils')
                .populate('interiors')
                .populate('owner');
            const countPost=await Post.countDocuments({owner:owner});

            return res.status(200).json({results,countPost});
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async getOne(req, res) {
        const { id } = req.params;
        const result = await Post.findById({ _id: id, deleted: false })
            .populate('categories')
            .populate('security')
            .populate('utils')
            .populate('interiors')
            .populate('owner');
        return res.status(200).json(result);
    }
    async getOneBySlug(req, res) {
        const { slug } = req.params;
        const result = await Post.findOne({ slug: slug, deleted: false })
            .populate('categories')
            .populate('security')
            .populate('utils')
            .populate('interiors')
            .populate([
                {
                    path: 'owner',
                    select : '_id firstname lastname email'
                },{
                path: 'comment',
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: 'user',
                        select: 'firstname lastname email'
                    },
                    {
                        path: 'reply',
                        populate: {
                            path: 'user',
                            select: 'firstname lastname email'
                        }
                    }
                ]
            }]);
        return res.status(200).json(result);
    }

    async updateOne(req, res) {
        const { id } = req.params;
        try {
            const result = await Post.findByIdAndUpdate(id, {...req.body });
            if (!result) {
                return res.status(404).json({ error: 'Bài viết không tồn tại.' });
            }

            return res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    }

    async deleteOne(req, res) {
        const { id } = req.params;
        try {
            const result = await Post.findByIdAndUpdate(id, { deleted: true });
            return res.status(200).json("Delete successfully")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async getAllDeleted(req, res) {
        const { owner } = req.params;
        try {
            const results = await Post.find({ owner: owner, deleted: true })
                .populate('categories')
                .populate('security')
                .populate('utils')
                .populate('interiors')
                .populate('owner');
                
            return res.status(200).json(results)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async getAllBock(req, res) {
        const { owner } = req.params;
        try {
            const results = await Post.find({ owner: owner, isLock: true })
                .populate('categories')
                .populate('security')
                .populate('utils')
                .populate('interiors')
                .populate('owner');
                
            return res.status(200).json(results)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async destroyOne(req, res) {
        const { id } = req.params;
        try {
            const result = await Post.findByIdAndDelete(id);
            return res.status(200).json("Delete successfully")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async restoreOne(req, res) {
        const { id } = req.params;
        try {
            const result = await Post.findByIdAndUpdate(id, { deleted: false });
            return res.status(200).json("Restore successfully")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }


    async getCommentOfPost(req, res) {
        try {
            const { postId } = req.params;
            const existPost = await Post.findById(postId);
            if (!existPost) {
                return res.status(500).json({ message: "Post is not exist" });
            }
            else {
                return res.status(200).json({
                    message: "Get Comment Successfully",
                    data: (await existPost.populate('comment')).comment
                })
            }
        } catch (error) {
            return res.status(500).json({ error: error.toString() });

        }
    }
    async addCommentToPost(req, res) {
        try {
            const { postId } = req.params;
            const existPost = await Post.findById(postId);
            if (!existPost) {
                return res.status(500).json({ message: "Post is not exist" });
            }
            else {
                const { content } = req.body;
                const comment = await Comment.create({ user: req.user.id, content });
                existPost.comment.push(comment._id);
                existPost.save();
                return res.status(201).json({
                    message: "Comment create successfully",
                    data: await comment.populate({
                        path: 'user',
                        select: 'firstname lastname email'
                    })
                })
            }

        } catch (error) {
            return res.status(500).json({ error: error.toString() });

        }
    }
    async replyComment(req, res) {
        try {
            const { commentId } = req.params;
            const existComment = await Comment.findById(commentId);
            if (!existComment) {
                return res.status(500).json({ message: "Comment does not exist" });
            } else {
                const { content } = req.body;
                existComment.reply.push({ content, user: req.user.id });
                existComment.save();
    
                await existComment.populate({
                    path: "reply.user",
                    select: "firstname lastname email"
                })
    
                const newReply = existComment.reply[existComment.reply.length - 1]; // Lấy câu trả lời cuối cùng trong mảng
    
                return res.status(201).json({
                    message: "Reply comment successfully",
                    data: newReply
                });
            }
        } catch (error) {
            return res.status(500).json({ error: error.toString() });
        }
    }

    async likeComment(req,res){
        try {
            const userId = req.user.id;
            const {commentId} = req.body;
            const comment = await Comment.findById(commentId);
            if (!comment){
                return res.status(500).json({message:"Comment not found"})
            }
            else{
                const userLiked = comment.likes?.some((like) => like.user.toString() === userId);
                if (userLiked){
                    const likeIndex = comment.likes.findIndex((like) => like.user.toString() === userId);
                    comment.likes.splice(likeIndex, 1);
                    comment.like -= 1;
                    await comment.save();
                    return res.status(200).json({message: "DisLike!!!",action:'dislike'});
                    
                }else{
                    comment.likes.push({user:userId});
                    comment.like += 1;
                    await comment.save();
                    return res.status(200).json({
                        message: "Like!!!",
                        action: 'like'
                    })
                }
            }
        } catch (error) {
            return res.status(500).json({ error: error.toString() });
            
        }
    }


}

module.exports = new PostService();
