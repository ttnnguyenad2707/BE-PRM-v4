import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './Bodysearch.scss'
import {
    UserOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const Searchresult = ({ dataSource, currentPage, setCurrentPage, checkNext, checkPrev, totalPages, addFavorite, removeFavorite, user }) => {
    const [favorite, setFavorite] = useState();
    const number = [];
    const data = dataSource;
    const numberPages = totalPages;
    let favoritePosts;
    if (user != null) {
        favoritePosts = user.favorites;
    }
    for (let i = 1; i <= numberPages; i++) {
        number.push(i);
    }
    const Checkclick = (id) => {
        console.log(id);
        var element = document.getElementById(id);
        if (user != null) {
            if (element && element.className === "bi-heart") {
                element.className = "bi-heart-fill";
                addFavorite(user._id, id);
                toast.success('Đã thêm vào yêu thích')
            } else {
                element.className = "bi-heart";
                removeFavorite(user._id, id);
                toast.warning('Đã gỡ bỏ yêu thích')
            }
        }
        else{
            toast.error('Hãy đăng nhập để sử dụng tiện tích này')
        }
    };
    const navigate = useNavigate();
    const handleDetails = (slug) => {
        navigate(`/post/${slug}`)
    }
    return (
        <>
            {data?.map((m) => {
                return (
                    <div className='Bodysearch d-flex flex-column gap-3'>
                        <div className='Card_search d-flex gap-4'>
                            <img src={m.images[0].url} className='image-card' />
                            <div className='d-flex flex-column gap-4'>
                                <h5 onClick={() => handleDetails(m.slug)}>{m.title}</h5>
                                <p>
                                    {m.area} mét vuông
                                </p>
                                <p>{m.price}</p>
                                <div className='d-flex gap-2'>
                                    <UserOutlined style={{ color: '#E66D4F', fontSize: '20px' }} />
                                    <p>{m.title}</p>
                                    <EnvironmentOutlined style={{ color: '#E66D4F', fontSize: '20px' }} />
                                    <p>{m.address}</p>
                                </div>
                            </div>
                            {user != null ?
                                (favoritePosts.includes(m._id) ? (
                                    <button className='btn-favorite d-flex mb-3 me-4' onClick={() => Checkclick(m._id)}>
                                        <i className="bi-heart-fill" id={m._id}> Save</i>
                                    </button>
                                ) : (
                                    <button className='btn-favorite d-flex mb-3 me-4' onClick={() => Checkclick(m._id)}>
                                        <i className="bi-heart" id={m._id}> Save</i>
                                    </button>
                                ))
                                :
                                (
                                    <button className='btn-favorite d-flex mb-3 me-4' onClick={() => Checkclick(m._id)}>
                                        <i className="bi-heart" id={m._id}> Save</i>
                                    </button>
                                )
                            }
                        </div>
                    </div>
                );
            })}
            {numberPages > 1 &&
                <div className='d-flex gap-1 justify-content-end mt-5'>
                    <button className='pagging' onClick={() => checkPrev()}>prev</button>
                    {number.map((m) => {
                        if (m === currentPage) {
                            return (
                                <button key={m} className='pagging is-active'>
                                    {m}
                                </button>
                            );
                        }
                        return (
                            <button key={m} className='pagging' onClick={() => setCurrentPage(m)}>
                                {m}
                            </button>
                        );
                    })}
                    <button className='pagging' onClick={() => checkNext()}>next</button>
                </div>
            }
        </>
    );

}

export default Searchresult