import axios from 'axios';
import { URL_SERVER } from '../dataConfig';
import Cookies from 'js-cookie';


export const getAll = async (page,search,address,area,minPrice,maxPrice,utils) => {
    const token = Cookies.get('accessToken');
    const params = {
        page:page,
        search: search,
        address: address,
        area: area,
        minPrice: minPrice,
        maxPrice: maxPrice,
        utils: utils
      };
    return await axios.get(`${URL_SERVER}/post/`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        },
        params: params,
    })
}
export const getOneBySlug = async (slug) => {
    const token = Cookies.get('accessToken');

    return await axios.get(`${URL_SERVER}/post/slug/${slug}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const getAllByOwner = async (owner) => {
    const token = Cookies.get('accessToken');

    return await axios.get(`${URL_SERVER}/post/owner/${owner}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const getAllDeleted = async (owner) => {
    const token = Cookies.get('accessToken');

    return await axios.get(`${URL_SERVER}/post/deleted/${owner}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const deleteOne = async (id) => {
    const token = Cookies.get('accessToken');

    return await axios.delete(`${URL_SERVER}/post/${id}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const destroyOne = async (id) => {
    const token = Cookies.get('accessToken');

    return await axios.delete(`${URL_SERVER}/post/destroy/${id}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const restoreOne = async (id) => {
    const token = Cookies.get('accessToken');

    return await axios.put(`${URL_SERVER}/post/rs/${id}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}















export const getPostedStore = async (type, token1) => {


    if (type === 'posted') {
        return await axios.get(`${URL_SERVER}/post/getPosted`, {
            withCredentials: true,

            headers: {
                token: `Bearer ${token1}`,
            }
        })
    }

    else if (type === 'deleted') {
        return await axios.get(`${URL_SERVER}/post/getdeletedpost`, {

            headers: {
                token: `Bearer ${token1}`,
            }
        })

    }
}
export const createPost = async (data, token) => {
    console.log(data, "created");
    return await axios.post(`${URL_SERVER}/post/`, data, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}
// updateOne


export const getPostedById = async (id) => {
    const token = Cookies.get('accessToken');
    console.log("id", id);
    return await axios.get(`${URL_SERVER}/post/${id}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const deletePost = async (id) => {
    const token = Cookies.get('accessToken');
    return await axios.delete(`${URL_SERVER}/post/${id}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const editPost = async (id, data, token) => {
    // const token = Cookies.get('accessToken');

    return await axios.put(`${URL_SERVER}/post/${id}`, data, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const restorePost = async (id) => {
    const token = Cookies.get('accessToken');

    return await axios.post(`${URL_SERVER}/post/${id}`, null, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const destroyPost = async (id) => {
    const token = Cookies.get('accessToken');

    return await axios.delete(`${URL_SERVER}/post/destroy/${id}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const getDetailPost = async (slug) => {

    return await axios.get(`${URL_SERVER}/post/${slug}`)
}

export const getPosterInfo = async (id) => {
    return await axios.get(`${URL_SERVER}/user/${id}`)
}

// export const getAllPost = async () => {
//     return await axios.get(`${URL_SERVER}/post/`)
// }

export const getPostedByOwner = async (id) => {
    return await axios.get(`${URL_SERVER}/post/getpostedbyowner/${id}`)
}
export const searchPost = async (title, currentPage) => {
    const token = Cookies.get('accessToken');

    return await axios.get(`${URL_SERVER}/post/search/${title}/${currentPage}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const getAllPost = async (currentPage) => {
    const token = Cookies.get('accessToken');

    return await axios.get(`${URL_SERVER}/post/getAll/${currentPage}`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const getPostfilter = async (address, area, price, utils, currentPage) => {
    const token = Cookies.get('accessToken');
    console.log(address, area, price, utils, currentPage, 'day la services');

    return await axios.post(`${URL_SERVER}/post/search/filter`, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        },
        body: {
            address: address,
            area: area,
            price: price,
            utils: utils,
            currentPage: currentPage,
        }
    })
}

export const addPostfavourite = async (userId, idPost) => {
    const token = Cookies.get('accessToken');
    console.log(userId, idPost, 'day la services');

    return await axios.put(`${URL_SERVER}/post/favorites`, {
        userId: userId,
        idPost: idPost,
    }, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const removePostfavourite = async (userId, idPost) => {
    const token = Cookies.get('accessToken');
    console.log(userId, idPost, 'day la services');

    return await axios.put(`${URL_SERVER}/post/favorites/Removefavorites`, {
        userId: userId,
        idPost: idPost,
    }, {
        withCredentials: true,

        headers: {
            token: `Bearer ${token}`,
        }
    })
}