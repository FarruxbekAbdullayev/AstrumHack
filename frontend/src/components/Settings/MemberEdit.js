import React, { useState, useCallback } from 'react';
import { Modal, Input, Form, Select, message, Tabs, Button } from 'antd';
import PropTypes from 'prop-types';
import { omitUpdateProps, t } from '../../utils';
import { UPDATE_USER } from '../../services/users.service';
import { LANGUAGES, MEMBER_ROLES } from '../../constants';
import UploadComponent from '../Upload';

const { Option } = Select;
const { TabPane } = Tabs;
export default function MemberEdit({ isVisible, hideModal, fetchData, data={} }) {
  const {password=null, ...rest} = {...data};
  const [inputValues, setInputValues] = useState(rest);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if(name === 'phone' && value.length === 14) {
      return
    }
    
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);

  const handleStatusChange = (status) => {
    setInputValues((state) => ({ ...state, status }));
  };

  const handleLangChange = (value) => {
    setInputValues((state) => ({ ...state, lang: value }));
  };

  const handleRoleChange = (value) => {
    setInputValues((state) => ({ ...state, role: value }));
  };

  const handleFileChange = (info) => {
    setInputValues((state) => ({ ...state, image: info.file?._id }));
  } 

  const handleSubmit = async () => {
    const {_id, password, ...rest} = inputValues;
    const updateData = omitUpdateProps(rest);
    const { data } = await UPDATE_USER(_id, {...updateData});

    if (data) {
      message.success(t('Member updated successfully'));
      fetchData();
      hideModal();
    }
  };

  const handleSecuritySubmit = async () => {
    const {_id, password} = inputValues;
    const { data } = await UPDATE_USER(_id, {
      password
    });

    if (data) {
      message.success(t('Password updated successfully'));
      fetchData();
      hideModal();
    }
  };

  const { address, email, role, firstName, phone, lang, status, lastName } =
    {...inputValues};

  return (
    <Modal
      title={t('Update Member')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={t('Update Member')}
      cancelText={t('Cancel')}
      onOk={handleSubmit}
      centered
      onCancel={hideModal}
    >

      <Tabs defaultActiveKey="details">
        <TabPane tab={t('Details')} key="details">
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
            fileList={inputValues?.image || null}
            edit={true}
          />
        </Form.Item>
        <Form.Item label={t('First Name')}>
          <Input
           name="firstName" 
           value={firstName} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item label={t('Last Name')}>
          <Input
           name="lastName" 
           value={lastName} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item label={t('Phone')}>
          <Input
           name="phone" 
           value={phone} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item label={t('Email')}>
          <Input
           name="email" 
           value={email} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item label={t('Address')}>
          <Input
           name="address" 
           value={address} 
           onChange={handleInputChange} 
          />
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
        </TabPane>
        <TabPane tab={t('Security')} key="security">
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
        <Form.Item label={t('Password')}>
          <input hidden type='password' />
          <Input.Password
           name="password" 
           value={inputValues.password} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleSecuritySubmit} size="large" type="primary">
            {t('Update Password')}
          </Button>
        </Form.Item>
      </Form>
        </TabPane>
        
      </Tabs>
      
    </Modal>
  );
}

MemberEdit.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired
};
