// the h3,card { image,dien tich, price,title,button save} and add slick
import React, { useRef } from 'react';
import { Card } from 'antd';
import Slider from "react-slick";
import { useNavigate,useOutletContext } from 'react-router-dom';
import { deleteOnInFavorites, addFavorite } from '../../services/user.service';
import './Carousel_Product.scss';
import { ToastContainer, toast } from 'react-toastify';
import { Link, NavLink } from 'react-router-dom';
import {
    HomeOutlined,
    DollarOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import PostCard from '../PostCard/PostCard.component';
const CarouselProduct = ({ data }) => {
    const dataSource = data;
    const navigate = useNavigate();
    const [user, setUser] = useOutletContext();
    const { Meta } = Card;
    let favoritePosts;
    let settings;
    // if (data.length > 5) {
        settings = {
            infinite: true,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
        };

    // }
    // else {
    //     settings = {
    //         unslick: true,
    //     }
    // }
    if (user != null) {
        favoritePosts = user.favorites;
    }
    const addPostfavourites = async (userId, idPost) => {
        try {
            const posts = (await addFavorite(idPost, userId));
        } catch (error) {
            
        }
    }
    const removePostfavourites = async (userId, idPost) => {
        try {
            const posts = (await deleteOnInFavorites(idPost, userId));
        } catch (error) {
            
        }
    }

    const Checkclick = (id) => {
        console.log(id);
        var element = document.getElementById(id);
        if (user != null) {
            if (element && element.className === "bi-heart") {
                element.className = "bi-heart-fill";
                addPostfavourites(user._id, id);
                toast.success('Đã thêm vào yêu thích')
            } else {
                element.className = "bi-heart";
                removePostfavourites(user._id, id);
                toast.warning('Đã gỡ bỏ yêu thích')
            }
        }
        else{
            toast.error('Hãy đăng nhập để sử dụng tiện tích này')
        }
    };
    console.log(user);
    return (
        <div className="product-list">

            <Slider {...settings}>
                {dataSource?.map((post) => {
                    return (
                        <div className='Card' key={post._id}>
                            <PostCard post={post} users={user} favorites={favoritePosts} checkclick= {Checkclick}/>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}
export default CarouselProduct;