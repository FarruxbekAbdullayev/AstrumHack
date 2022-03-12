import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Form, Select, message, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { t } from '../../utils';
import { CREATE_USER, FETCH_TRAINERS } from '../../services/users.service';
import { LANGUAGES } from '../../constants';
import { FETCH_MEMBERSHIP } from '../../services/membership.service';
import UploadComponent from '../Upload';
import { useMemo } from 'react';

const { Option } = Select;

export default function MemberAdd({ isVisible, hideModal, fetchData }) {
  const [memberships, setMemberships] = useState([]);
  const [trainersData, setTrainers] = useState([]);
  const [inputValues, setInputValues] = useState({
    phone: null,
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    status: 'active',
    lang: 'uz',
    role: 'member',
    membership: null,
    image: null,
    trainer: null,
    membershipStart: null,
    membershipEnd: null,
  });

  const fetchMemberships = async () => {
    const { data } = await FETCH_MEMBERSHIP();
    const { data: trainerData } = await FETCH_TRAINERS();
    if (data && trainerData) {
      setMemberships(data);
      setTrainers(trainerData)
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleMembership = (membership) => {
    setInputValues((state) => ({ ...state, membership }));
  };

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

  const handleStatusChange = (value) => {
    setInputValues((state) => ({ ...state, status: value }));
  };

  const handleFileChange = (info) => {
    setInputValues((state) => ({ ...state, image: info.file?._id }));
  };
  
  const  handleDateChange = (date, name) => {
    setInputValues((state) => ({ ...state, [name]: date }));
  };

  const handleSubmit = async () => {
    const { data } = await CREATE_USER(inputValues);

    if (data) {
      hideModal();
      fetchData();
      message.success(t('User created successfully'));
    }
  };

  const { address, membership, firstName, phone, lang, status, lastName, membershipStart, membershipEnd } =
    inputValues;

  const selectedMembership = useMemo(() => memberships.find((item) => item._id === membership), [ memberships, membership ]);

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
        <Form.Item label={t('Membership')} required>
          <Select 
            value={membership} 
            style={{ width: '100%' }} 
            onChange={handleMembership}
            showSearch
            filterOption={(input, option) =>  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {memberships.map(({ _id, title }) => (
              <Option key={_id} value={_id}>
                {title}
              </Option>
            ))}
          </Select>
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
        <Form.Item label={t('Address')}>
          <Input name="address" value={address} onChange={handleInputChange} />
        </Form.Item>
        {
          selectedMembership?.duration && (
            <>
              <Form.Item label={t('Membership Start')}>
                <DatePicker
                  name="membershipStart"
                  value={membershipStart}
                  onChange={(e) => handleDateChange(e, 'membershipStart')}
                  style={{ width: '100%' }}
                  showToday
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item label={t('Membership End')}>
                <DatePicker
                  name="membershipEnd"
                  value={membershipEnd}
                  onChange={(e) => handleDateChange(e, 'membershipEnd')}
                  style={{ width: '100%' }}
                  showToday
                  allowClear={false}
                />
              </Form.Item>
            </>
          )
        }
        <Form.Item label={t('Trainer')}>
          <Select
            name="status"
            style={{ width: '100%' }}
            allowClear
            onChange={(e) => setInputValues({...inputValues, trainer: e})}
          >
            <Option value={null}>{t("Coach is not needed")}</Option>
            {trainersData?.map(item => (
              <Option value={item?._id}>{item.firstName} {item.lastName}</Option>
            ))}
          </Select>
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
        <Form.Item label={t('Language')}>
          <Select 
            value={lang} 
            style={{ width: '100%' }} 
            onChange={handleLangChange}
          >
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
