import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Posted.scss'
import images from '../../assets/images';
import { Modal, Tabs } from 'antd';
import { Space, Table } from "antd"
import { LoadingOutlined, } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import Column from 'antd/es/table/Column';
import { deleteOne, destroyOne, getAllByOwner, getAllDeleted, restoreOne } from '../../services/post.service';
import { getUser } from '../../services/user.service'
import ColumnGroup from 'antd/es/table/ColumnGroup';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import Cookies from 'js-cookie';

const Posted = () => {
    const navigate = useNavigate();
    const token1 = Cookies.get('accessToken');

    const [user] = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('1');
    const [postedData, setPostedData] = useState([]);
    const [deletedData, setDeletedData] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [postId, setPostId] = useState('');
    const [userInf, setUserInf] = useState({});
    const [countPost,setCountPost]=useState(0)
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const fetchData = async () => {
        const { data } = await getUser(user._id);
        setUserInf(data)
        if (activeTab === "1") {
            const { data } = await getAllByOwner(user._id);
            setPostedData(data.results);
            setCountPost(data.countPost)
        } else if (activeTab === "2") {
            const { data } = await getAllDeleted(user._id);
            setDeletedData(data);
        }
    };

    useEffect(() => {
        if (user && user._id) {
            setIsLoading(false);
            fetchData();
        }
    }, [activeTab, user]);
    const handleDelete = async (id) => {
        const result = window.confirm("Delete");
        if (result) {
            await deleteOne(id);
            setPostedData(prevData => prevData.filter(post => post._id !== id));
        }
    };

    const handleEdit = (slug, record) => {
        navigate(`${slug}`, { state: record });
    };

    const handleRestore = async (id) => {
        await restoreOne(id);
        setDeletedData(prevData => prevData.filter(post => post._id !== id));
    };

    const handleDestroy = async (id) => {
        if (window.confirm("Bạn thật sự muốn loại bỏ bài viết này ?")) {
            await destroyOne(id);
            setDeletedData(prevData => prevData.filter(post => post._id !== id));
        }
    };

    return (
        <div>
            {isLoading ? (<div className='text-center'>
                <LoadingOutlined />
            </div>
            )
                : (<div className='component-usePosted bg-F4F4F4 '>
                    <div className='container'>
                        <div className='content '>
                            <div className='component-title'>Quản lý tin của bạn</div>
                            <div className='profile-user d-flex justify-content-between border-1 border'>

                                <div className='user-box d-flex align-items-center gap-3'>
                                    <div className='avatar' >
                                        <img src={user.avatar == null ? images.avatarDefault : user.avatar} alt='avatar' height="80px" />
                                    </div>
                                    <div className='user-link d-flex flex-column gap-2'>
                                        <div className='username'>{user.firstname}</div>
                                        <div className='list-button d-flex gap-2'>
                                            <button className='btn btn-outline-danger' onClick={() => { navigate("/profile") }}>Trang cá nhân</button>
                                            <Link to='/post/create' className='btn btn-outline-danger'>Đăng bài viết mới </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='more-info d-flex flex-column gap-3'>
                                    <div className='btn-bg-primary text-white p-2 rounded'>Loại tài khoản: <strong>{userInf.isVip ? "VIP" : "Not VIP"}</strong></div>
                                    <div className='btn-bg-primary text-white p-2 rounded'>Số lượng bài đăng: <strong>{userInf.isVip ? `${countPost}/∞` : `${countPost}/10`}</strong></div>
                                </div>

                            </div>
                            {/* <Tabs defaultActiveKey="1" items={items} />  */}
                            <Tabs activeKey={activeTab} onChange={handleTabChange} >
                                <TabPane tab="Bài viết đã đăng" key="1">
                                    <Table dataSource={postedData}>
                                        <ColumnGroup>
                                            <Column
                                                title="Số thứ tự"
                                                dataIndex="_index"
                                                key="_index"
                                                render={(_, __, index) => index + 1}
                                            />
                                            <Column title="Tiêu đề" dataIndex="title" key="title" />
                                            <Column title="Địa chỉ" dataIndex="address" key="address" />
                                            <Column title="Giá thuê" dataIndex="price" key="price" />
                                            <Column title="Số người" dataIndex="maxPeople" key="maxPeople" />
                                            <Column title="Action" key="action" render={(_, record) => (
                                                <Space size="middle">
                                                    <a className="btn btn-outline-info" onClick={() => handleEdit(record.slug, record)}>Edit</a>
                                                    <a className="btn btn-outline-danger" onClick={() => handleDelete(record._id)}>Delete</a>
                                                </Space>
                                            )} />
                                        </ColumnGroup>

                                    </Table>
                                </TabPane>
                                <TabPane tab="Bài Viết đã xóa" key="2">
                                    <Table dataSource={deletedData}>
                                        <ColumnGroup>
                                            <Column
                                                title="Số thứ tự"
                                                dataIndex="_index"
                                                key="_index"
                                                render={(_, __, index) => index + 1}
                                            />
                                            <Column title="Tiêu đề" dataIndex="title" key="title" />
                                            <Column title="Địa chỉ" dataIndex="address" key="address" />
                                            <Column title="Giá thuê" dataIndex="price" key="price" />
                                            <Column title="Số người" dataIndex="maxPeople" key="maxPeople" />

                                            <Column title="Action" key="action" render={(_, record) => (
                                                <Space size="middle">
                                                    <a className="btn btn-outline-info" onClick={() => handleRestore(record._id)}>Restore</a>
                                                    <a className="btn btn-outline-danger" onClick={() => handleDestroy(record._id)}>Destroy</a>
                                                </Space>
                                            )} />
                                        </ColumnGroup>
                                    </Table>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>

                </div>)}
        </div>


    )
}

export default Posted