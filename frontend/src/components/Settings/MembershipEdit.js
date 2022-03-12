import React, { useState, useCallback } from 'react';
import { Modal, Input, Form, Select, message } from 'antd';
import PropTypes from 'prop-types';
import { omitUpdateProps, t } from '../../utils';
import { MEMBERSHIP_TYPES } from '../../constants';
import { UPDATE_MEMBERSHIP } from '../../services/membership.service';

export default function PlanAdd({ isVisible, hideModal, fetchData, data }) {
  const [inputValues, setInputValues] = useState(data);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);

  const handleChange = (value) => {
    setInputValues((state) => ({ ...state, duration: value }));
  };

  const handleTagsChange = (value) => {
    setInputValues((state) => ({ ...state, tags: value }));
  };

  const handleSubmit = async () => {
    const {  _id, ...rest } = inputValues;
    const updateData = omitUpdateProps(rest);
    const { data } = await UPDATE_MEMBERSHIP(_id, {
      ...updateData,
      price: +inputValues.price
    });

    if (data) {
      message.success(t('Plan updated successfully'));
      fetchData();
      hideModal();
    }
  };

  const { price, subTitle, tags, title, duration } = inputValues;

  return (
    <Modal
      title={t('Update Plan')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={t('Update Plan')}
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
        <Form.Item label={t('Plan Title')}>
          <Input
           name="title" 
           value={title} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item label={t('Plan Text')}>
          <Input
           name="subTitle" 
           value={subTitle} 
           onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item label={t('Plan Price')}>
          <Input
            type="number"
            name="price"
            value={price}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label={t('Plan')}>
          <Select
            placeholder={t('Select membership')}
            value={duration}
            onChange={handleChange}
            name="duration"
            style={{ width: '100%' }}
          >
            {Object.values(MEMBERSHIP_TYPES).map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t('Plan Tags')}>
          <Select
            value={tags}
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Plan Tags"
            onChange={handleTagsChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

PlanAdd.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  data: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    tags: PropTypes.array,
    price: PropTypes.number,
    duration: PropTypes.string
  })
};
