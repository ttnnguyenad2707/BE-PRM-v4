import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
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

import { addComment, likeComment, replyComment } from '../../services/comment.service'
import { toast } from 'react-toastify'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { io } from "socket.io-client";
import Cookies from "js-cookie";
function formatCurrency(number) {
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    });
  }
const socket = io('http://localhost:5000');
const PostDetails = () => {
    const token = Cookies.get('accessToken');
    const navigate = useNavigate();
    const { slug } = useParams();
    const [postDetail, setPostDetail] = useState({});
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isGetMe, setIsGetMe] = useState(false)

    const [me] = useOutletContext();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getDetail();
    }, []);

    useEffect(() => {
        if (Object.keys(postDetail).length !== 0) {
            setIsLoading(false);
        }
    }, [postDetail]);
    useEffect(() => {
        if (me) {
            setIsGetMe(true);
        }
    }, [me]);


    useEffect(() => {
        realTimeComment();
    }, []);
    const realTimeComment = () => {
        socket.on('newComment', (comment) => {
            setComments((prevComments) => [comment, ...prevComments]);
        });
        socket.on('newReply', (updateComments) => {
            setComments(updateComments);
        })
        socket.on('newLike', (updateComments) => {
            setComments(updateComments)
        })
    }

    const getDetail = async () => {
        try {
            const response = await getOneBySlug(slug);
            if (response.status === 200) {
                setPostDetail(response.data);
                setComments(response.data.comment)
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

    const handleAddComment = (e) => {
        e.preventDefault();
        const content = e.target.comment.value;
        if (content.trim() === "") {
            toast("Content comment is empty");
        } else {

            addComment({ postId: postDetail._id, content })
                .then((data) => {
                    toast(data.data.message);
                    // Thêm comment mới vào danh sách comment
                    // setComments([...comments, data.data.data]);
                    socket.emit('comment', data.data.data);
                })
                .catch((error) => toast(error));
        }
        e.target.comment.value = ''
    };
    const handleLike = (id) => {
        console.log(id);

        likeComment({ commentId: id })
            .then((data) => {
                toast(data.data.message);
                const action = data.data.action.toString();

                const updatedComments = comments.map((comment) => {
                    if (comment._id === id) {
                        if (action === 'dislike') {
                            // Xóa người dùng khỏi danh sách likes
                            comment.likes = comment.likes.filter(
                                (like) => like.user.toString() !== me?._id
                            );
                            comment.like -= 1;
                        } else if (action === 'like') {
                            // Thêm người dùng vào danh sách likes
                            comment.likes.push({ user: me?._id });
                            comment.like += 1;
                        }
                    }
                    return comment;
                });

                // setComments(updatedComments);
                socket.emit('like', updatedComments);
            })
            .catch((error) => toast(error));
    };
    const handleOpenReply = (commentId) => {
        const boxReply = document.getElementById(commentId);
        if (boxReply.getAttribute('hidden')) {

            document.getElementById(commentId).removeAttribute("hidden");
            document.getElementById(commentId).querySelector('form input').focus();
        }
        else {
            document.getElementById(commentId).setAttribute("hidden", 'true');

        }
    }
    const handleReplyComment = (e, commentId) => {
        e.preventDefault()
        const content = e.target.commentReply.value;
        replyComment({ commentId, content }).then(data => {
            toast(data.data.message)
            const updateComment = comments.map(comment => {
                if (comment._id === commentId) {
                    console.log(data.data.data);
                    comment.reply.push({ content: data.data.data.content, user: { firstname: data.data.data.user.firstname, lastname: data.data.data.user.lastname, userId: data.data.data.user._id } });

                }
                return comment;
            })

            // setComments(updateComment)
            socket.emit('reply', updateComment)
        }).catch(error => toast(error))
        e.target.commentReply.value = ''
    }


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
                                    <div className="container mt-5 mb-5">
                                        <div className="row height justify-content-center align-items-center">
                                            <div className="col-md-12">
                                                <div className="card">
                                                    <div className="p-3">
                                                        <h6>Comments</h6>
                                                    </div>
                                                    {token ? (<div className="mt-3 d-flex flex-row align-items-center p-3 form-color">
                                                        <img src="https://i.imgur.com/zQZSWrt.jpg" width="50" className="rounded-circle mr-2" />
                                                        <form onSubmit={handleAddComment}>
                                                            <input name='comment' type="text" className="form-control ms-4" placeholder="Enter your comment..." />
                                                        </form>
                                                    </div>) : (<div className='d-flex align-items-center justify-content-center gap-4'>
                                                        <h4>Bạn cần đăng nhập để bình luận </h4>

                                                        <Link to='/login' className="btn btn-primary">Login</Link>
                                                    </div>)}

                                                    <div className="mt-2">
                                                        {comments?.map(comment => {
                                                            if (comment) {
                                                                if (comment?.reply) {
                                                                    return (
                                                                        <>
                                                                            <div className="d-flex flex-row p-3">
                                                                                <img src="https://i.imgur.com/zQZSWrt.jpg" width="40" height="40" className="rounded-circle mr-3" />
                                                                                <div className="w-100">
                                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                                        <div className="d-flex flex-row align-items-center">
                                                                                            <span className="mr-2">{comment?.user?.firstname} {comment?.user?.lastname}</span>
                                                                                        </div>
                                                                                        {/* <small>12h ago</small> */}
                                                                                    </div>
                                                                                    <p className="text-justify comment-text mb-0">{comment?.content}</p>
                                                                                    <div className="d-flex flex-row user-feed">
                                                                                        <span className="wish">
                                                                                            <i className="fa fa-heartbeat me-2"></i>{comment?.like}
                                                                                            {isGetMe === true && (
                                                                                                <>
                                                                                                    {comment.likes.some(likes => likes.user.toString() == me?._id) === false && <HeartOutlined onClick={() => handleLike(comment?._id)} />}
                                                                                                    {comment.likes.some(likes => likes.user.toString() == me?._id) === true && <HeartFilled onClick={() => handleLike(comment?._id)} />}
                                                                                                </>
                                                                                            )}
                                                                                            {isGetMe === false && (
                                                                                                <div>
                                                                                                </div>
                                                                                            )}
                                                                                        </span>
                                                                                        <span onClick={() => handleOpenReply(comment._id)} className="ms-3 btn btn-primary">
                                                                                            Reply

                                                                                        </span>

                                                                                    </div>


                                                                                </div>
                                                                            </div>
                                                                            <div hidden id={comment._id}>
                                                                                {comment?.reply?.map(reply => (
                                                                                    <div className="d-flex flex-row p-3 ms-5 ps-5">
                                                                                        <img src="https://i.imgur.com/zQZSWrt.jpg" width="40" height="40" className="rounded-circle mr-3" />
                                                                                        <div className="w-100">
                                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                                <div className="d-flex flex-row align-items-center">
                                                                                                    <span className="mr-2">{reply?.user?.firstname} {reply?.user?.lastname}</span>
                                                                                                </div>
                                                                                                <small>12h ago</small>
                                                                                            </div>
                                                                                            <p className="text-justify comment-text mb-0">{reply?.content}</p>
                                                                                            <div className="d-flex flex-row user-feed">
                                                                                                <span className="wish">
                                                                                                    <i className="fa fa-heartbeat me-2"></i>{reply?.like} like
                                                                                                </span>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                ))}
                                                                                <div className='ms-5 ps-5' >
                                                                                    <img src="https://i.imgur.com/zQZSWrt.jpg" width="50" className="rounded-circle mr-2" />

                                                                                    <form onSubmit={(e) => handleReplyComment(e, comment._id)}>
                                                                                        <input name='commentReply' type="text" className="form-control ms-4" placeholder="Enter your comment..." />
                                                                                    </form>
                                                                                </div>
                                                                            </div>
                                                                        </>

                                                                    )
                                                                }


                                                            }
                                                            else {
                                                                return (<div></div>)
                                                            }
                                                        })}


                                                    </div>
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
                                        <img className='rounded-circle' width="100px" height="100px" src={me.avatar == null ? images.avatarDefault : me.avatar} alt='avatar-poster' />
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