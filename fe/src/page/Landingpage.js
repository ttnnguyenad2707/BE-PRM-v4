import Category from '../components/Category/Category.js';
import CarouselProduct from '../components/Carousel/Carousel_Product.js';
import Footer from '../components/Footer/Footer.js';
import { Layout, Space, Carousel } from 'antd';
import '../scss/Landingpage.scss'
import { UserContext } from '../App';
import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { checkUser } from '../services/auth.service';
import { getAll, getAllPost_pagging, getPostedStore } from '../services/post.service.js';
import { useNavigate, NavLink } from 'react-router-dom'
import {LoadingOutlined} from '@ant-design/icons';
const Landingpage = () => {
    const [user, setUser] = useState({});
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = Cookies.get('accessToken');
    
    // useEffect(() => {
    //   if (!token) {
    //     navigate('/');
    //     return;
    //   }

    //   checkUser(token)
    //     .then((res) => {
    //       setUser(res.data);
    //     })
    //     .catch((error) => {
    //       if (error.response && error.response.status === 403) {
    //         navigate('/login');
    //       }
    //     });
    // }, [token, navigate]);
    const onChange = (currentSlide) => {
        // console.log(currentSlide);
    };
    // const getData = async () => {
    //     try {
    //         const posts = (await getAllPost(1)).data.data;
    //         setData(posts);
    //     } catch (error) {

    //     }
    // }
    const getData = async () => {
        try {
          const response = await getAll(1);
          if (response.status === 200) {
            setData(response.data.posts);
          } else {
            console.error('Failed to fetch products');
          }
        } catch (error) {
          console.error('An error occurred while fetching products:', error);
        }
      };
    useEffect(() => {
        getData();
    }, []);
      
     console.log(data);
    return (
        <>
        {isLoading == true && (<><div className="unset-slick-dots-li-button-before">
                <Carousel afterChange={onChange} autoplay>
                    <div className="card-img">
                        <img src="https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FUcvcfUTYee0oRvekvI9K8zaCMCuJU3JE1G96GzRY2JU%2Fpreset%3Araw%2Fplain%2Fa9ad0f1e7102ae6b4e9ddc12cb6a9620-2828674230988306341.jpg&w=3840&q=90"
                            className="slider-img " alt='slider image' />
                    </div>
                    <div className="card-img">
                        <img src="https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2Fjb79jSf2SUm1HDPcmE9tFBgBlFrurP-s_ewyFn5FJIY%2Fpreset%3Araw%2Fplain%2F1d576c2f920b35aa6eb1ae9ce6a1ccda-2839151063611486956.jpg&w=3840&q=90"
                            className="slider-img " alt='slider image' />
                    </div>
                    <div className="card-img">
                        <img src="https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FveScoYPqB2TIpSbs2HCMOY6ZDVpcs21DlBQWp5a3Up8%2Fpreset%3Araw%2Fplain%2Fee1123abbc4c91975cf7a5f42c046d5b-2816676295139993019.jpg&w=1920&q=90"
                            className="slider-img " alt='slider image' />
                    </div>
                    <div className="card-img">
                        <img src="https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fcdn.chotot.com%2Fadmincentre%2FCLc_w4ezPe5nBtt513RxAYir2B7cA_7o_t-T8Y-XqBY%2Fpreset%3Araw%2Fplain%2Ff312d513187e97ea4db9177c566be218-2840451184318895286.jpg&w=1920&q=90"
                            className="slider-img " alt='slider image' />
                    </div>
                </Carousel>
            </div>
            <div className="container list-category margin-top2 d-flex flex-column gap-3">
                <h3 className="title-1">Dịch Vụ </h3>
                <Category />
            </div>
            <div className="container list-product-new margin-top2 d-flex flex-column gap-3">

                <NavLink className=' d-flex flex-column justify-content-center'>
                    <h3 className="title-1">Nhà trọ mới </h3>
                </NavLink>

                <CarouselProduct data={data} />
            </div>
            <div className="container list-product margin-top2 d-flex flex-column gap-3">
                <NavLink className=' d-flex flex-column justify-content-center'>
                <h3 className="title-1">Danh sách nhà trọ</h3>
                </NavLink>
                <CarouselProduct data={data} />
            </div>
            <div className=" margin-top2">
                <Footer />
            </div></>)}
            {/* {isLoading == true && (<div className="text-center mt-5 fs-1"><LoadingOutlined /><div className='fs-2'>Loading ...</div> </div>)} */}
            

        </>

    );
}

export default Landingpage;