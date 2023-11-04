import {
    HomeOutlined,
    DollarOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
const PostCard = ({post,users,favorites,checkclick,}) => {
    const navigate = useNavigate();

    const displayDetails = (slug) => {
        navigate(`/post/${slug}`);
    }

    
    return (
        <Card
            hoverable
            style={{
                width: '95%',
                minHeight: '480px'
            }}
            cover={<img alt="example" src={post.images[0].url} />}
        >
            <div className='d-flex flex-column gap-2'>
                <h6 className='d-flex gap-2'>
                    <HomeOutlined />
                    {post.title}
                </h6>
                <p className='d-flex gap-2'><DollarOutlined />{post.price}</p>
                <p className='d-flex gap-2'><EnvironmentOutlined />{post.address}</p>
                <button className='btn_detail'  onClick={() => displayDetails(post.slug)}>
                        
                            Xem chi tiết
                        
                </button>
                {users != null ?
                                (favorites.includes(post._id) ? (
                                    <button className='btn-favorite d-flex mb-3 me-4' onClick={() => checkclick(post._id)}>
                                        <i className="bi-heart-fill" id={post._id}> Save</i>
                                    </button>
                                ) : (
                                    <button className='btn-favorite d-flex mb-3 me-4' onClick={() => checkclick(post._id)}>
                                        <i className="bi-heart" id={post._id}> Save</i>
                                    </button>
                                ))
                                :
                                (
                                    <button className='btn-favorite d-flex mb-3 me-4' onClick={() => checkclick(post._id)}>
                                        <i className="bi-heart" id={post._id}> Save</i>
                                    </button>
                                )
                            }
            </div>
        </Card>
    )
}

export default PostCard