// the h3,card { image,dien tich, price,title,button save} and add slick
import React, { useRef } from 'react';
import { Card } from 'antd';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Carousel_Product.scss';
import {
    HomeOutlined,
    DollarOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import PostCard from '../PostCard/PostCard.component';
const CarouselProduct = ({ data }) => {
    const dataSource = data;
    const navigate = useNavigate();
    const { Meta } = Card;
    let settings;
    // if(data.length > 5){
        settings = {
            infinite: true,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
        };

    // }
    // else{
    //     settings = {
    //         unslick: true,
    //     }
    // }

    const displayDetails = (id) => {
        console.log(id);
        navigate('/detail', { id: id });
    }
    return (
        <div className="product-list">

            <Slider {...settings}>
                {dataSource?.map((post) => {
                    return (
                        <div className='Card'>
                            <PostCard post={post}/>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}
export default CarouselProduct;