import axios from 'axios';
import { URL_SERVER } from '../dataConfig';
import Cookies from 'js-cookie';

export const addComment = async ({postId,content}) => {
    const token = Cookies.get('accessToken');

    return await axios.post(`${URL_SERVER}/post/${postId}/comment`,{content},{
        withCredentials: true,
        
        headers: {
            token: `Bearer ${token}`,
        }
    })
}
export const likeComment = async ({commentId}) => {
    const token = Cookies.get('accessToken');

    return await axios.put(`${URL_SERVER}/post/comment/like`,{commentId},{
        withCredentials: true,
        
        headers: {
            token: `Bearer ${token}`,
        }
    })
}

export const replyComment = async ({commentId,content}) => {
    const token = Cookies.get('accessToken');

    return await axios.post(`${URL_SERVER}/post/comment/${commentId}/reply`,{content},{
        withCredentials: true,
        
        headers: {
            token: `Bearer ${token}`,
        }
    })
}
