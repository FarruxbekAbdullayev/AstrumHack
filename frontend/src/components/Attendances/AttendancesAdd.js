import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, message, DatePicker, TimePicker } from 'antd';
import PropTypes from 'prop-types';
import { t } from '../../utils';
import {  FETCH_USER } from '../../services/users.service';
import {  CREATE_ATTANDANCE, UPDATE_ATTANDANCE } from '../../services/attendance.service';
import { ATTENDANCE_STATUS, ATTENDANCE_ACTIONS } from '../../constants';
import moment from 'moment';

const { Option } = Select;
const initialValue = {
  status: ATTENDANCE_STATUS.active.value,
  userId: null,
  checkInTime: moment(),
  checkOutTime: moment(),
  date: moment(),
};

export default function AttendanceAdd({ isVisible, hideModal, fetchData, data=initialValue, actionType }) {
  const updateId = data?._id 
  const [members, setMembers] = useState([]);
  const [inputValues, setInputValues] = useState(data ?? initialValue);

  const fetchMemberships = async () => {
    const { data } = await FETCH_USER();
    if (data) {
      setMembers(data);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  console.log(inputValues);

  const handleMembership = (userId) => {
    setInputValues((state) => ({ ...state, userId }));
  };

  const handleDateChange = (value, name) => {
    setInputValues((state) => ({ ...state, [name]: value }));
  };

  const editHandler = async() => {
    const {userId, checkInTime, checkOutTime, date} = inputValues;
    const { data } = await UPDATE_ATTANDANCE(updateId, {
      userId,
      checkInTime,
      checkOutTime,
      date
    });
    if (data) {
      hideModal();
      fetchData();
      message.success(t('Attendance updated successfully'));
    }
  }

  const createHandler = async() => {
    delete inputValues.status
    const { data } = await CREATE_ATTANDANCE(inputValues);

    if (data) {
      hideModal();
      fetchData();
      message.success(t('Attendance created successfully'));
    }
  }

  const handleSubmit = async () => {
    if (actionType === 'create') {
      createHandler()
    } else {
      editHandler()
    }
  };

  const { 
    userId,
    checkInTime,
    checkOutTime,
    date
  } =
    inputValues;

  return (
    <Modal
      title={ATTENDANCE_ACTIONS[actionType]}
      style={{ top: 20 }}
      visible={isVisible}
      okText={ATTENDANCE_ACTIONS[actionType]}
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
        <Form.Item label={t('User Id')} required>
          <Select 
            allowClear 
            defaultValue={userId} 
            style={{ width: '100%' }} 
            onChange={handleMembership}
            showSearch
            filterOption={(input, option) =>  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {members?.map(({ _id, firstName, lastName }) => (
              <Option key={_id} value={_id}>
                {firstName + ' ' + lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item required label={t('Date')}>
          <DatePicker
            name="date"
            defaultValue={moment(date ? new Date(date) : new Date(), 'DD.MM.YYYY')}
            onChange={(e) => handleDateChange(e._d, 'date')}
            style={{ width: '100%' }}
            format={'DD.MM.YYYY'}
            showToday
          />
        </Form.Item>
        <Form.Item required label={t('Arrival time')}>
          <TimePicker
            name="checkInTime"
            defaultValue={moment(checkInTime ? new Date(checkInTime) : new Date(), 'hh:mm')}
            onChange={(e) => handleDateChange(e._d, 'checkInTime')}
            style={{ width: '100%' }}
            format={'hh:mm'}
            showToday
            allowClear={false}
          />
        </Form.Item>
        <Form.Item label={t('Leaving time')}>
          <TimePicker
            name="checkOutTime"
            defaultValue={moment(checkOutTime ? new Date(checkOutTime) : new Date(), 'hh:mm')}
            onChange={(e) => handleDateChange(e._d, 'checkOutTime')}
            style={{ width: '100%' }}
            format={'hh:mm'}
            showToday
            allowClear={false}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

AttendanceAdd.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired
};
