// @ts-ignore
const Post = require('../models/post.model');
const User = require('../models/user.model');


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
            .populate('owner');
        return res.status(200).json(result);
    }

    async updateOne(req, res) {
        const { id } = req.params;
        const images = req.files.map(file => ({
            url: `/public/images/${file.filename}`,
            caption: `Caption for ${file.originalname}`,
        }));
        try {
            const result = await Post.findByIdAndUpdate(id, { images, ...req.body });
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
            const result = await Post.findByIdAndUpdate(id, { deleted: false })
            return res.status(200).json("Restore successfully")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    //////////////////////////////////////////////////////////////

    // async getAll(req, res) {
    //     const dataSize = await Post.find({ deleted: false })
    //     const currentPage = parseInt(req.params.currentPage);
    //     const perPage = 10;
    //     const totalPages = Math.ceil(dataSize.length / perPage);
    //     const skip = (currentPage - 1) * perPage;
    //     const result = await Post.find({ deleted: false })
    //         .skip(skip)
    //         .limit(perPage).exec();

    //     const data = {
    //         data: result,
    //         totalPages: totalPages,
    //     }
    //     return res.status(200).json(data)
    // }
    async readPostWithQuantity(req, res) {
        const quantityOfPost = await req.query.number;
        const result = await Post.find({}).limit(quantityOfPost);
        return res.status(200).json(result);
    }

    async getPosted(req, res) {
        const user_id = req.user.id;
        const result = await Post.find({ owner: user_id, deleted: false });
        return res.status(200).json(result);
    }
    async deletePost(req, res) {
        const idPost = await req.params.id;

        try {
            const result = await Post.findByIdAndUpdate({ _id: idPost }, { deleted: true, deletedAt: Date.now() });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ Error: error.toString() })
        }
    }
    async getDetail(req, res) {
        try {
            const { slug } = req.params;
            const PostDetails = await Post.findOne({ slug: slug });
            return res.status(200).json(PostDetails);
        } catch (error) {
            return res.status(500).json({ Error: error.toString() })
        }

    }

    async getSearchValue(req, res) {
        const searchParam = req.params.searchParam;
        const dataSize = await Post.find({ title: { $regex: searchParam, $options: 'i' } })
        const currentPage = parseInt(req.params.currentPage);
        const perPage = 10;
        const totalPages = Math.ceil(dataSize.length / perPage);
        try {
            const skip = (currentPage - 1) * perPage;

            const result = await Post.find({ title: { $regex: searchParam, $options: 'i', deleted: false } })
                .skip(skip)
                .limit(perPage)
                .exec();

            if (result.length === 0) {
                return res.status(404).json({ message: "No results found" });
            }
            const data = {
                data: result,
                totalPages: totalPages,
            }
            return res.status(200).json({ message: "Search result", data: data });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async loadDeletedPost(req, res) {
        try {
            const result = await Post.find({ deleted: true, owner: req.user.id });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ Error: error.toString() })
        }
    }
    async getPostedById(req, res) {
        const idPost = await req.params.id;
        try {
            const result = await Post.find({ _id: idPost, deleted: false });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ Error: error.toString() })
        }
    }

    async restorePost(req, res) {
        const idPost = await req.params.id;
        try {
            const result = await Post.findByIdAndUpdate({ _id: idPost }, { deleted: false, deletedAt: null });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ Error: error.toString() })
        }
    }

    async destroyPostById(req, res) {
        const idPost = await req.params.id;
        try {
            const result = await Post.findByIdAndDelete({ _id: idPost });
            return res.status(200).json({
                message: "Destroy successfully",
                ...result._doc
            });
        } catch (error) {
            return res.status(500).json({ Error: error.toString() })
        }
    }
    async getFilterValue({ address, area, price, utils, currentPage }) {
        const query = {};
        const perPage = 10;
        try {
            const skip = (currentPage - 1) * perPage;

            if (address && Array.isArray(address) && address.length > 0) {
                const concatenatedAddress = address.join(', ');
                query.address = { $regex: concatenatedAddress, $options: 'i' };
            }
            if (area && Array.isArray(area) && area.length > 0) {
                query.area = { $gte: parseFloat(area[0]) };
            }
            if (price && Array.isArray(price) && price.length > 0) {
                const priceQueries = price.map(priceRange => {
                    const [min, max] = priceRange.split('-');
                    return {
                        $and: [
                            { price: { $gte: parseFloat(min) } },
                            { price: { $lte: parseFloat(max) } }
                        ]
                    };
                });
                query.$or = priceQueries;
            }
            if (utils && Array.isArray(utils) && utils.length > 0) {
                query.utils = { $all: utils };
            }
            query.deleted = false
            const result = await Post.find(query)
                .skip(skip)
                .limit(perPage)
                .exec();

            return result;
        } catch (error) {
            return { error: error.message };
        }
    }
    async getLandingPost(req, res) {
        try {
            const result = await Post.find().sort({ createdAt: -1 })
                .limit(10)
                .exec();
            return res.status(200).json({
                message: "get landing post success",
                data: result
            });
        } catch (error) {
            return res.status(500).json({ error: error.toString() });
        }
    }
    async favoritePost(req, res) {
        try {
            const { userId, idPost } = req.body;
            const getUser = await User.findById({ _id: userId });
            const getAllFarvorite = getUser.favoritePost;
            getAllFarvorite.push(idPost);
            const result = await User.findByIdAndUpdate({ _id: userId }, { favoritePost: getAllFarvorite });
            return res.status(200).json("Add favorites succesfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getPostedByOwner(req, res) {
        try {
            const { id } = req.params;
            const listPost = await Post.find({ owner: id, deleted: false });
            return res.status(200).json(listPost);
        } catch (error) {
            return res.status(500).json({ Error: error.toString() })
        }

    }
    async removeFavoritePost(req, res) {
        try {
            const { userId, idPost } = req.body;
            const getUser = await User.findById(userId);
            const getAllFavorite = getUser.favoritePost;

            const updatedFavorite = getAllFavorite.filter(postId => postId !== idPost);

            const result = await User.findByIdAndUpdate(userId, { favoritePost: updatedFavorite });

            return res.status(200).json("Remove favorite successfully");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    async sortByCreateDate(req, res) {
        try {
            const dataSize = await Post.find({ deleted: false })
            const currentPage = parseInt(req.params.currentPage);
            const perPage = 10;
            const totalPages = Math.ceil(dataSize.length / perPage);
            const skip = (currentPage - 1) * perPage;
            const result = await Post.find().sort({ createdAt: -1, deleted: false })
                .skip(skip)
                .limit(perPage).exec();
            return res.status(200).json({
                message: "get sorted by createDate post success",
                data: result,
                totalPage: totalPages
            });
        } catch (error) {
            return res.status(500).json({ error: error.toString() });
        }
    }
    async sortByPrice(req, res) {
        try {
            const dataSize = await Post.find({ deleted: false })
            const currentPage = parseInt(req.params.currentPage);
            const perPage = 10;
            const totalPages = Math.ceil(dataSize.length / perPage);
            const skip = (currentPage - 1) * perPage;
            const result = await Post.find().sort({ price: -1, deleted: false })
                .skip(skip)
                .limit(perPage).exec();
            return res.status(200).json({
                message: "get sorted post by price success",
                data: result,
                totalPage: totalPages
            });
        } catch (error) {
            return res.status(500).json({ error: error.toString() });
        }
    }
}

module.exports = new PostService();
