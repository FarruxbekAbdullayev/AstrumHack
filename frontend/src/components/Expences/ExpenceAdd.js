import React, { useState, useCallback,useEffect, useMemo } from 'react';
import { Modal, Input, Form, Select, message, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { omitUpdateProps, t } from '../../utils';
import { EXPENCE_TYPES, EXPENCE_PURPOSES } from '../../constants';
import moment from 'moment';
import { FETCH_STUFF } from '../../services/users.service';
import { CREATE_EXPENCE, UPDATE_EXPENCE } from '../../services/expence.service';

const { Option } = Select;

export default function SaleAdd({ isVisible, hideModal, fetchData, data, edit=false }) {
  const userType = useSelector((state) => (state.account.role));
  const [users, setUsers] = useState([]);
  const [inputValues, setInputValues] = useState({
    expenseType:   EXPENCE_TYPES.cash.value,
    purpose:  EXPENCE_PURPOSES.other.value,
    note: '',
    amount: 0,
    expenseDate:  moment(),
    user: ''
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);

  useEffect(() => {
    if(inputValues.product) {
      setInputValues((state) => ({ 
        ...state, 
        total: 1 * inputValues.amount,
        quantity: 1 
      }));
    }
  },[inputValues.product]);

  const handleStatusChange = (value) => {
    setInputValues((state) => ({ ...state, purpose: value }));
  };

  const handleExpenseType = (value) => {
    setInputValues((state) => ({ ...state, expenseType: value }));
  };
  const handleUser = (value) => {
    setInputValues((state) => ({ ...state, user: value }));
  };

  const fetchProducts = async () => {
    const { data } = await FETCH_STUFF();
    if (data) {
      setUsers(data);
    }
  };

  const handleDateChange = (date, dateString) => {
    setInputValues((state) => ({ ...state, expenseDate: date }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  const handleSubmit = async () => {
    let result = null;
    if(edit) {
      const {_id, status, ...rest} = inputValues;
      const updatedData = omitUpdateProps(rest);

      const respons = await UPDATE_EXPENCE(data._id, {
        ...updatedData,
        amount: +inputValues.amount,
        status,
      });
      result = respons.data;
    } else {
      const response = await CREATE_EXPENCE({
        ...inputValues,
        amount: +inputValues.amount,
      });

      result = response.data;
    }
    
    if (result) {
      message.success(t('Sale added successfully'));
      fetchData();
      hideModal();
    }
  };

  const { amount, status, expenseType, expenseDate, user, purpose, note } = inputValues;

  return (
    <Modal
      title={t('Add expence')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={`${t('Total')} ${Number(amount).toLocaleString()}`}
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
        <Form.Item label={t('Purpose')}>
          <Select
            value={status}
            name="purpose"
            style={{ width: '100%' }}
            onChange={handleStatusChange}
          >
            {Object.values(EXPENCE_PURPOSES).map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {
            purpose === "salary" && 
            <Form.Item label={t('Employees')}>
                <Select
                    value={user}
                    name="user"
                    style={{ width: '100%' }}
                    onChange={handleUser}
                >
                    {users?.map((item) => (
                    <Option key={item._id} value={item._id}>
                        {item?.firstName} {item?.lastName}
                    </Option>
                    ))}
                </Select>
            </Form.Item>
        }
        <Form.Item label={t('Amount')}>
          <Input type='number' name="amount" value={amount} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Expence date')}>
          <DatePicker
            name="expenseDate"
            value={expenseDate}
            onChange={handleDateChange}
            style={{ width: '100%' }}
            format={'DD.MM.YYYY'}
            disabledDate={userType == 'reception' ? disabledDate : null}
            showToday
          />
        </Form.Item>
        <Form.Item label={t('Expence Type')}>
          <Select
            value={expenseType}
            name="expenseType"
            style={{ width: '100%' }}
            onChange={handleExpenseType}
          >
            {Object.values(EXPENCE_TYPES).map((item) => (
              <Option key={item.value} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("Note")} name="note">
            <Input.TextArea 
                value={note} 
                onChange={handleInputChange} 
                name='note' 
                placeholder={t("Note")} 
            />
        </Form.Item>
      </Form>
    </Modal>
  );
}

SaleAdd.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};
