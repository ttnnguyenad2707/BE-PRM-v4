import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import './Menu_Admin.scss'
const Menuadmin = () => {
    const [subActive, setsubActive] = useState('');
    const navigate = useNavigate();
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    const items = [
        getItem('Manage content', 'sub1', <MailOutlined />),
        getItem('Manage user', 'sub2', <AppstoreOutlined />),
        {
            type: 'divider',
        },
        getItem('Setting System', 'sub3', <SettingOutlined />),
    ];
    const onClick = (e) => {
        setsubActive(e.key);
    };
    useEffect(() => {
        if (subActive) {
            // Thực hiện điều hướng sau khi cập nhật trạng thái
            navigateToDashboard(subActive);
        }
    }, [subActive]);

    const navigateToDashboard = (subActive) => {
        if(subActive == 'sub1'){
            navigate('/admin/post');
        }
        else if(subActive == 'sub2'){
            navigate('/admin/account');
        }
        else if(subActive == 'sub3'){
            navigate('/admin/categories');
        }
        else if(subActive == 'sub4'){
            navigate('/admin/security');
        }
        else if(subActive == 'sub5'){
            navigate('/admin/interiors');
        }
        else if(subActive == 'sub6'){
            navigate('/admin/utils');
        }
    };
    return (
        <div className='menu_admin'>
            <Menu
                onClick={onClick}
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundColor: '#f7efe5',
                    fontSize: 'medium',
                    fontWeight: 'bold',
                    color: '#E66D4F'
                }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
        </div>
    );
};
export default Menuadmin;