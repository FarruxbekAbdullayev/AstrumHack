import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Form, Select, message } from 'antd';
import PropTypes from 'prop-types';
import { t } from '../../utils';
import { CREATE__COURSE } from '../../services/course.service';

const { Option } = Select;
const { TextArea } = Input;

export default function CourseAdd({ isVisible, hideModal, fetchData }) {
  const [inputValues, setInputValues] = useState({
    name: '',
    durationType: "month",
    duration: 0,
    description: '',
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if(name === 'phone' && value.length === 14) {
      return
    }
    
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);

  const handleDurationChange = (value) => {
    setInputValues((state) => ({ ...state, durationType: value }));
  };

  const handleSubmit = async () => {
    const data = await CREATE__COURSE(inputValues);

    if (data) {
      hideModal();
      fetchData();
      message.success(t('Course created successfully'));
    }
  };

  const { name, duration , durationType, description } =
    inputValues;

  return (
    <Modal
      title={t('Add Course')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={t('Create Course')}
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
        <Form.Item label={t('Name')}>
          <Input name="name" value={name} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Duration Type')} required>
          <Select 
            value={durationType} 
            style={{ width: '100%' }} 
            onChange={handleDurationChange}
          >
              <Option key='month' value='month'>
                Month
              </Option>
              <Option key='week' value='week'>
                Week
              </Option>
          </Select>
        </Form.Item>
        <Form.Item label={t('Duration')}>
          <Input name="duration" value={duration} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Description')}>
          <TextArea name="description" value={description} onChange={handleInputChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

CourseAdd.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired
};
