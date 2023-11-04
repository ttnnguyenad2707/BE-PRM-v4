import { useNavigate, useParams } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import images from '../../assets/images'
import { GlobalOutlined, MessageOutlined, PhoneOutlined, LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { getOneBySlug } from '../../services/post.service'
import { getUser } from "../../services/user.service"
import moment from 'moment';
import Map from '../Map/Map.component'
import Slider from 'react-slick'
import MapContainer from './MapContainer.component'
function formatCurrency(number) {
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    });
  }
const PostDetails = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [postDetail, setPostDetail] = useState({});
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getDetail();
    }, []);

    useEffect(() => {
        if (Object.keys(postDetail).length !== 0) {
            setIsLoading(false);
        }
    }, [postDetail]);

    const getDetail = async () => {
        try {
            const response = await getOneBySlug(slug);
            if (response.status === 200) {
                setPostDetail(response.data);
                await getDetailUser(response.data.owner._id);
            } else {
                console.error('Failed to fetch');
            }
        } catch (error) {
            console.error('An error occurred while fetching:', error);
        }
    };

    const getDetailUser = async (owner) => {
        try {
            const response = await getUser(owner);
            if (response.status === 200) {
                setUser(response.data);
            } else {
                console.error('Failed to fetch');
            }
        } catch (error) {
            console.error('An error occurred while fetching:', error);
        }
    };

    const handleLinkToProfile = (id) => {
        navigate(`/user/${id}`);
    };

    const handleNavigateChat = () => {
        localStorage.setItem('chatid', postDetail.owner?._id);
        navigate('/chat');
    };

    const renderImages = () => {
        return postDetail?.images?.map((image, index) => (
            <div key={index} style={{ height: '700px' }}>
                <img src={image.url} alt={`post-image-${index}`} width="100%" height="100%" />
            </div>
        ));
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <>
            {isLoading == false && (
                <div className='container'>
                    <div className='row'>
                        <div className='col-8'>
                            <div className='post-content'>
                                <div className='post-slide'>
                                    <Slider {...settings}>
                                        {postDetail?.images?.map(image => (
                                            <div style={{ height: '300px' ,width:'200px'}}>
                                                <img src={image.url} alt='post-image' width="100%" height="700px" />
                                            </div>
                                        ))}
                                    </Slider>



                                </div>
                                <div className='post-info'>
                                    <h4 className='title'>{postDetail.title}</h4>
                                    <div className='price'> {formatCurrency(postDetail.price)} triệu đồng / tháng  <span>{postDetail.area}m2</span> </div>
                                    <div className='d-flex gap-3'>
                                        <span> <GlobalOutlined /> {postDetail.address}</span>
                                        <span> Đăng ngày : {moment(new Date(postDetail.createdAt)).format('DD/MM/YYYY')} </span>
                                    </div>

                                    <div className='room-info'>

                                        <h4>Thông tin phòng trọ</h4>
                                        <div className='d-flex gap-3'>
                                            <ul>
                                                <li>An ninh :{postDetail.security?.map(security => (<span>{security.name}, </span>))}</li>
                                                <li>Nội thất:{postDetail.interior?.map(interior => (<span>{interior.name}, </span>))}</li>

                                            </ul>
                                            <ul>
                                                <li>Tiện ích khác : {postDetail.utils?.map(utils => (<span>{utils.name}, </span>))}</li>
                                                <li>Tiền cọc : {formatCurrency(postDetail.deposit)} vnd</li>
                                                <li>Số người tối đa : {postDetail.maxPeople} người</li>
                                            </ul>

                                        </div>
                                        <h4>Mô tả chi tiết</h4>
                                        <p>{postDetail.description}</p>
                                    </div>
                                </div>
                                <div className='room-address'>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7330253564114!2d105.51734237479548!3d21.00333628865218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31365730731c760b%3A0x6b107bdf681c16ac!2sThi%C3%AAn%20Long%20Building!5e0!3m2!1svi!2s!4v1697290825634!5m2!1svi!2s" width="100%" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                    {/* <MapContainer address="Hưng Yên" /> */}
                                </div>
                                <div className='post-comment'>
                                    <h4>Bình Luận or Đánh giá</h4>
                                    <div className='shadow p-3 mb-5 bg-body-tertiary rounded'>
                                        <div className='comment-box mb-3'>
                                            <div className='comment-user'>
                                                <div className='d-flex'>
                                                    <div className='avatar'>
                                                        <img src={images.avatarDefault} alt='avatar' width="100%"></img>
                                                    </div>
                                                    <div className='user-info'>
                                                        <div>Nguyen</div>
                                                        <div>20-10-2923</div>
                                                    </div>
                                                </div>
                                                <div className='comment-content'>
                                                    Phòng thực sự quá đẹp so với kỳ vọng của tôi cảm ơn page nhiều
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='col'>
                            <div className='shadow p-3 mb-5 bg-body-tertiary rounded'>
                                <div className='poster-box d-flex align-items-center'>
                                    <div className='d-flex gap-2'>
                                        <img src={images.avatarDefault} alt='avatar-poster' width="100%" />
                                        <span>{user.firstname} {user.lastname}</span>
                                    </div>
                                    <button onClick={() => handleLinkToProfile(user._id)} className='btn bt-primary'>Xem trang cá nhân</button>
                                </div>
                                <div className='contact-box d-flex gap-4 flex-column'>
                                    <h4>Liên hệ với người cho thuê</h4>
                                    <button className='btn bt-primary w-100 p-3 d-flex gap-3 align-items-center rounded' onClick={handleNavigateChat}>
                                        <MessageOutlined />
                                        Chat với người bán
                                    </button>
                                    <a href='tel:0943895292' className='btn bt-primary w-100 p-3 d-flex gap-3 align-items-center rounded'>
                                        <PhoneOutlined />
                                        Gọi {user.phone}
                                    </a>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            {isLoading == true && (<div className="text-center mt-5 fs-1"><LoadingOutlined /><div className='fs-2'>Loading ...</div> </div>)}
        </>

    )
}

export default PostDetails