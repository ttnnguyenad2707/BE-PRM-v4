import React, { useEffect, useState } from 'react';
import { Button, Modal, Tooltip, Input, Space, Select, TreeSelect } from 'antd';
import { SearchOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
const Searchbox = ({ datalocation }) => {
  const [open,setOpen] = useState(false)
  const [location , setLocation] = useState();
  const [price_min, setPriceMin] = useState();
  const [price_max, setPriceMax] = useState();
  const [area, setArea] = useState();
  const [amenities, setAmenities] = useState();
  const [search, setSearch] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const locations = datalocation;
  const navigate = useNavigate();
  const [modalText, setModalText] = useState('Content of the modal');
  const { Search } = Input;
  const onSearch = (value, _e, info) => {
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      navigate('/search', { state: { value } });
    }, 500);
  };
  let searchResult = "";
  let filter = [];
  const sumSearch = (value) => {
    searchResult.push(value);

  }
  const showModal = () => {
    setOpen(true);
  };
  const optionsAcreage = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '40', label: '40' },
    { value: '50', label: '50' }
  ];
  const optionsPricemin = [
    { value: '1000000', label: '1000000' },
    { value: '2000000', label: '2000000' },
    { value: '3000000', label: '3000000' },
  ];

  const optionsPricemax = [
    { value: '4000000', label: '4000000' },
    { value: '5000000', label: '5000000' },
    { value: '6000000', label: '6000000' },
  ];

  const optionsUtilities = [
    { value: 'Tủ Lạnh', label: 'Tủ Lạnh' },
    { value: 'Điều Hòa', label: 'Điều Hòa' },
    { value: 'Bình nóng lạnh', label: 'Bình nóng lạnh' },
    { value: 'Máy giặt', label: 'Máy giặt' }
  ];
  const handleChange_location = (value) => {
    setLocation(value);
  };

  const handleChange_price_min = (value) => {
    setPriceMin(value);
  };
  const handleChange_price_max = (value) => {
    setPriceMax(value);
  };
  const handleChange_area = (value) => {
    setArea(value);
  };

  const handleChange_amenities = (value) => {
    console.log(`selected ${value}`);
    setAmenities(value);
  };
  const handleChangeInput = (e) => {
    searchResult = e.target.value;
    setSearch(searchResult);
  }
  const handleOk = () => {
    let category = [{ address: location }, { price_min: price_min },{ price_max: price_max }, { amenities: amenities }, { area: area },{searchValue: search}];
    console.log(category);
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      navigate('/search', { state: { category: category } });
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  return (
    <>
      <Tooltip title="search">
        <Button shape="circle" icon={<SearchOutlined style={{ color: '#FFF' }} />} onClick={showModal} style={{ backgroundColor: '#E66D4F' }} />
      </Tooltip>
      <Modal
        title="Search"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Search"
      >
        <div className='d-flex flex-column row-gap-3'>
          <Search placeholder="Tìm kiếm phòng trọ..." onSearch={onSearch} onChange={handleChangeInput} size='30px' />
          <h6>Filter</h6>
          <div className='select-option d-flex column-gap-2'>
            {/* <Select
              mode="multiple"
              allowClear
              style={{
                width: '50%',
              }}
              placeholder="Vị Trí"
              onChange={handleChange}
              options={optionsLocation}
            /> */}
            <TreeSelect
              style={{
                width: '50%',
              }}
              dropdownStyle={{
                maxHeight: 400,
                overflow: 'auto',
              }}
              treeData={locations}
              placeholder="Vị trí"
              onSelect={handleChange_location}
              allowClear
            />
            <Select
              mode="multiple"
              allowClear
              style={{
                width: '50%',
              }}
              placeholder="Diện Tích"
              onSelect={handleChange_area}
              options={optionsAcreage}
            />
          </div>
          <div className='select-option d-flex column-gap-2'>
            <Input
              mode="multiple"
              allowClear
              style={{
                width: '50%',
              }}
              placeholder="Giá Tiền Thấp Nhất"
              // onSelect={handleChange_price_min}
              // options={optionsPricemin}
            />
            /
            <Input
              mode="multiple"
              allowClear
              style={{
                width: '50%',
              }}
              placeholder="Giá Tiền Cao Nhất"
              // onSelect={handleChange_price_max}
              // options={optionsPricemax}
            />
          </div>
          <div className='select-option d-flex column-gap-2'>
            <Select
              mode="multiple"
              allowClear
              style={{
                width: '100%',
              }}
              placeholder="Tiện Ích"
              onSelect={handleChange_amenities}
              options={optionsUtilities}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Searchbox;