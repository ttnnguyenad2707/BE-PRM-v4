import axios from 'axios';
import { URL_SERVER } from '../dataConfig';
import Cookies from 'js-cookie';
export const updateUser = async (token,id,data) => {
    return await axios.put(`${URL_SERVER}/user/${id}`,data, {
        withCredentials: true,
        
        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const changePassword = async (token,id,data) => {
    return await axios.put(`${URL_SERVER}/user/changePassword/${id}`,data, {
        withCredentials: true,
        
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const getUserList = async () => {
    const token = Cookies.get('accessToken');
    console.log(token);
    return await axios.get(`${URL_SERVER}/user/getlistusers/1`,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const lockUsers = async (id) => {
    const token = Cookies.get('accessToken');
    return await axios.put(`${URL_SERVER}/user/blockUser/${id}`,null,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const unlockUsers = async (id) => {
    const token = Cookies.get('accessToken');
    return await axios.put(`${URL_SERVER}/user/openUser/${id}`,null,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const updateroleServices = async (id) => {
    const token = Cookies.get('accessToken');
    console.log(token);
    return await axios.put(`${URL_SERVER}/user/upRole/${id}`,null,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const rollbackSevices = async (id) => {
    const token = Cookies.get('accessToken', 'hi');
    return await axios.put(`${URL_SERVER}/user/decreseRole/${id}`,null,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}







export const getUser = async (id) => {
    const token = Cookies.get('accessToken');
    return await axios.get(`${URL_SERVER}/user/${id}`,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const addFavorite = async (id,owner) => {
    const token = Cookies.get('accessToken');
    return await axios.put(`${URL_SERVER}/user/favorites/${id}`,{owner},{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const deleteOnInFavorites = async (id,owner) => {
    const token = Cookies.get('accessToken');
    return await axios.put(`${URL_SERVER}/user/favorites/rm/${id}`,{owner},{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const getFavorites = async (owner) => {
    const token = Cookies.get('accessToken');
    return await axios.get(`${URL_SERVER}/user/favorites/${owner}`,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const getLockList = async (owner) => {
    const token = Cookies.get('accessToken');
    return await axios.get(`${URL_SERVER}/post/${owner}/block/`,{
        withCredentials: true,
        headers: {
            token: `Bearer ${token}`,
        }
    })
}