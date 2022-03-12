import React, { useState, useCallback,useEffect } from 'react';
import { Modal, Input, Form, Select, message, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { omitUpdateProps, t } from '../../utils';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../../constants';
import { FETCH_USER } from '../../services/users.service';
import { UPDATE_PAYMENT } from '../../services/payments.service';
import moment from 'moment';

const { Option } = Select;

export default function PaymentsEdit({ isVisible, hideModal, fetchData, data }) {
  const [members, setMembers] = useState([]);
  const [inputValues, setInputValues] = useState({
    ...data,
    member: data?.member?._id
  });

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

  const handleDateChange = (date, dateString) => {
    setInputValues((state) => ({ ...state, paymentDate: date }));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async () => {
    const { _id, orderId, status, trainer, ...rest} = inputValues;
    const updateData = omitUpdateProps(rest);
    const { data } = await UPDATE_PAYMENT(_id,{
      ...updateData,
      price: +rest.price,
      status,
    });

    if (data) {
      message.success(t('Payment updated successfully'));
      fetchData();
      hideModal();
    }
  };

  const { price, member,  status, paymentMethod, paymentDate } = inputValues;

  return (
    <Modal
      title={t('Update Payment')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={t('Update Payment')}
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
          <Input type='number' name="price" value={price} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Payment date')}>
          <DatePicker
            name="paymentDate"
            value={moment(paymentDate)}
            format={'DD.MM.YYYY'}
            onChange={handleDateChange}
            style={{ width: '100%' }}
            showToday
          />
        </Form.Item>
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

PaymentsEdit.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired
};
