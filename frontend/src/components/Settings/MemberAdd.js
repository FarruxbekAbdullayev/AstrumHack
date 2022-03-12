import React, { useState, useCallback,} from 'react';
import { Modal, Input, Form, Select, message,  } from 'antd';
import PropTypes from 'prop-types';
import { t } from '../../utils';
import { CREATE_USER } from '../../services/users.service';
import { LANGUAGES, MEMBER_ROLES } from '../../constants';
import UploadComponent from '../Upload';

const { Option } = Select;

export default function MemberAdd({ isVisible, hideModal, fetchData }) {
  const [inputValues, setInputValues] = useState({
    email: '',
    password: null,
    phone: null,
    firstName: '',
    lastName: '',
    address: '',
    status: 'active',
    lang: 'uz',
    role: MEMBER_ROLES.reception.value,
    membership: null,
  });


  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if(name === 'phone' && value.length === 14) {
      return
    }
    
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);

  const handleLangChange = (value) => {
    setInputValues((state) => ({ ...state, lang: value }));
  };
  
  const handleRoleChange = (value) => {
    setInputValues((state) => ({ ...state, role: value }));
  };

  const handleStatusChange = (value) => {
    setInputValues((state) => ({ ...state, status: value }));
  };

  const handleFileChange = (info) => {
    setInputValues((state) => ({ ...state, image: info.file?._id }));
  } 

  const handleSubmit = async () => {
    const { data } = await CREATE_USER(inputValues);

    if (data) {
      hideModal();
      fetchData();
      message.success(t('User created successfully'));
    }
  };

  const { address, email, firstName, role, phone, password, lang, status, lastName } =
    inputValues;

  return (
    <Modal
      title={t('Add Member')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={t('Create Member')}
      cancelText={t('Cancel')}
      onOk={handleSubmit}
      centered
      onCancel={hideModal}
    >
      <Form
        name="basic"
        labelCol={{
          span: 10
        }}
        wrapperCol={{
          span: 24
        }}
        initialValues={{
          remember: true
        }}
        autoComplete="on"
        layout="vertical"
      >
        <Form.Item label={t('Image')}>
          <UploadComponent 
            onChange={handleFileChange}
            multiple={false}
            uploadType="product"
          />
        </Form.Item>
        <Form.Item label={t('First Name')}>
          <Input name="firstName" value={firstName} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Last Name')}>
          <Input name="lastName" value={lastName} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Phone')} required>
          <Input name="phone" value={phone} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Email')} required>
          <Input name="email" value={email} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Password')} required>
          <Input.Password name="password" value={password} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Address')}>
          <Input name="address" value={address} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Status')}>
          <Select
            value={status}
            name="status"
            style={{ width: '100%' }}
            onChange={handleStatusChange}
          >
            <Option value="active">{t('Active')}</Option>
            <Option value="inactive">{t('In Active')}</Option>
          </Select>
        </Form.Item>
        <Form.Item label={t('Role')}>
          <Select value={role} style={{ width: '100%' }} onChange={handleRoleChange}>
            {Object.values(MEMBER_ROLES).map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {t(item.label)}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label={t('Language')}>
          <Select value={lang} style={{ width: '100%' }} onChange={handleLangChange}>
            {Object.values(LANGUAGES).map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {t(item.label)}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

MemberAdd.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired
};
