import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Tabs, Button, message, Form, Input, Image, Select, Upload } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { updateAccount } from '../../redux/auth/reducer';
import { AiFillCheckCircle, AiOutlineEdit } from 'react-icons/ai';
import { omitUpdateProps, t } from '../../utils';
import { StyledSettings } from '../../views/Settings/Settings.style';
import { UPDATE_USER, FETCH_USER_DETAILS } from '../../services/users.service';
import { useRef } from 'react';

const { Option } = Select;
const { TabPane } = Tabs;

export default function Profile() {
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();
  const uploadRef = useRef(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    lang: account.lang,
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProfile(state => ({ ...state, [name]: value }));
  };

  const handleSelectChange = value => {
    setProfile(state => ({ ...state, lang: value }));
  };

  const handleSubmit = async () => {
    const { _id, ...rest } = profile;
    const updatedProfile = omitUpdateProps(rest);
    const { data } = await UPDATE_USER(_id, updatedProfile);

    if (data) {
      dispatch(updateAccount(data));
      message.success(t('Profile updated successfully'));
    }
  };

  const fetchUser = async () => {
    const { data } = await FETCH_USER_DETAILS(account?._id);
    setProfile(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="image-inner">
        <Image width={120} height={120} style={{ objectFit: 'cover' }} src="https://cdn.pixabay.com/photo/2022/01/29/11/58/dog-6977210_960_720.jpg" />
        

        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="text"
          ref={uploadRef}
          // onPreview={this.handlePreview}
          // onChange={this.handleChange}
          openFileDialogOnClick={true}
          fileList={[{uid: 1, url: 'https://cdn.pixabay.com/photo/2022/01/29/11/58/dog-6977210_960_720.jpg'}]}
        >
          
        </Upload>
        <Button type="primary" onClick={() => uploadRef.current.click()} shape="circle" icon={<AiOutlineEdit />} size="large" />
      </div>
      <Tabs defaultActiveKey="1" style={{ width: '70%', margin: 'auto' }}>
        <TabPane tab={t('Profile info')} key="1">
          <Form layout="vertical">
            <Form.Item label={t('First Name')}>
              <Input value={profile.firstName} onChange={handleInputChange} name="firstName" placeholder={t('First Name')} />
            </Form.Item>
            <Form.Item label={t('Last Name')}>
              <Input value={profile.lastName} onChange={handleInputChange} name="lastName" placeholder={t('Last Name')} />
            </Form.Item>
            <Form.Item label={t('Address')}>
              <Input value={profile.address} onChange={handleInputChange} name="address" placeholder={t('Address')} />
            </Form.Item>
            <Form.Item label={t('Email')}>
              <Input value={profile.email} onChange={handleInputChange} name="email" placeholder={t('Email')} />
            </Form.Item>
            <Form.Item label={t('Phone')}>
              <Input value={profile.phone} onChange={handleInputChange} name="phone" placeholder={t('Phone')} />
            </Form.Item>
            <Form.Item label={t('Password')}>
              <Input.Password value={profile.password} onChange={handleInputChange} name="password" />
            </Form.Item>
            <Form.Item label={t('Language')}>
              <Select onChange={handleSelectChange} defaultValue={account.lang} style={{ textAlign: 'left' }}>
                <Option value="uz">UZ</Option>
                <Option value="ru">RU</Option>
                <Option value="en">EN</Option>
              </Select>
            </Form.Item>
            <Form.Item className="form__btn">
              <Button onClick={handleSubmit} size="large" type="primary">
                {t('Save')}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </>
  );
}