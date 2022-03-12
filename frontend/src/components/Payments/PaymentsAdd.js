import React, { useState, useCallback,useEffect } from 'react';
import { Modal, Input, Form, Select, message, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { t } from '../../utils';
import {  PAYMENT_METHODS, PAYMENT_STATUS } from '../../constants';
import { FETCH_USER } from '../../services/users.service';
import { UPDATE_USER } from '../../services/users.service';
import { CREATE_PAYMENT } from '../../services/payments.service';
import moment from 'moment';

const { Option } = Select;

export default function PaymentsAdd({ isVisible, hideModal, fetchData }) {
  const userType = useSelector((state) => (state.account.role));
  const [members, setMembers] = useState([]);
  const [inputValues, setInputValues] = useState({
    price: null,
    member: null,
    paymentMethod: PAYMENT_METHODS.cash.value,
    status: PAYMENT_STATUS.paid.value,
    paymentDate: moment()
  });
  const [membershipEndDate, setMembershipEndDate] = useState(moment());

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);


  const handleMemberSelect = (value) => {
    const member = members.find(i => i._id === value);
    setInputValues((state) => ({ ...state, member: value, price: member?.membership?.price || 0 }));
  };

  const handleStatusChange = (value) => {
    setInputValues((state) => ({ ...state, status: value }));
  };

  const handlePaymentMethod = (value) => {
    setInputValues((state) => ({ ...state, paymentMethod: value }));
  };

  const fetchMembers = async () => {
    const { data } = await FETCH_USER();
    if (data) {
      setMembers(data);
    }
  };

  const filteredMember = members.filter((item) => {
    const id = item?._id?.toLowerCase();
    if (id?.includes(inputValues?.member?.toLowerCase())) {
      return item;
    } else {
    }
  });
  
  const handleDateChange = (date, dateString) => {
    setInputValues((state) => ({ ...state, paymentDate: date }));
  };
  
  const handleMembershipDateChange = (date, dateString) => {
    setMembershipEndDate(date);
  };
  
  useEffect(() => {
    fetchMembers();
  }, []);

  const handleMemberChange = async () => {
    
    const { data } = await UPDATE_USER(filteredMember[0]?._id, {
      
      membershipEnd: membershipEndDate,
      membership: filteredMember[0]?.membership?._id
    });
  };

  const handleSubmit = async () => {
    if(inputValues.member && inputValues.price && inputValues.paymentMethod && inputValues.status && inputValues.paymentDate) {
      const { data } = await CREATE_PAYMENT({
        ...inputValues,
        price: +inputValues.price,
      });
      if (data) {
        message.success(t('Payment added successfully'));
        fetchData();
        hideModal();
      }
      handleMemberChange();
    } else {
      message.error(t('Please fill all the fields'));
    }
  };
  
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  const { price, member, status, paymentMethod, paymentDate } = inputValues;

  return (
    <Modal
      title={t('Add Payment')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={t('Create Payment')}
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
        <Form.Item label={t('Member')}>
          <Select
            value={member}
            name="member"
            style={{ width: '100%' }}
            onChange={handleMemberSelect}
            showSearch
            filterOption={(input, option) =>  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {members.map((item) => (
              <Option
                key={item._id}
                value={item._id}
              >{`${item.firstName} ${item.lastName}`}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t('Price')}>
          <Input
           type='number' 
           name="price" 
           value={price} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item label={t('Payment date')}>
          <DatePicker
            name="paymentDate"
            value={paymentDate}
            onChange={handleDateChange}
            style={{ width: '100%' }}
            format={'DD.MM.YYYY'}
            disabledDate={userType == 'reception' ? disabledDate : null}
            showToday
          />
        </Form.Item>
        {
          inputValues.member ? (
            <Form.Item label={t('Membership End Date')}>
              <DatePicker
                value={membershipEndDate}
                onChange={handleMembershipDateChange}
                style={{ width: '100%' }}
                showToday
              />
            </Form.Item>
          ) : (
            null
          )
        }
        <Form.Item label={t('Payment Method')}>
          <Select
            value={paymentMethod}
            name="paymentMethod"
            style={{ width: '100%' }}
            onChange={handlePaymentMethod}
          >
            {Object.values(PAYMENT_METHODS).map((item) => (
              <Option key={item.value} value={item.key}>
                {item.label}
              </Option>
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
            {Object.values(PAYMENT_STATUS).map((item) => (
              <Option key={item.value} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

PaymentsAdd.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired
};
