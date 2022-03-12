import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Input, Form, Select, message, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { omitUpdateProps, t } from '../../utils';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../../constants';
import moment from 'moment';
import { FETCH_PRODUCTS } from '../../services/products.service';
import { CREATE_SALE, UPDATE_SALE } from '../../services/sales.service';

const { Option } = Select;

export default function SaleAdd({ isVisible, hideModal, fetchData, data, edit = false }) {
  const [products, setProducts] = useState([]);
  const [inputValues, setInputValues] = useState({
    price: data?.price || '',
    product: data._id || null,
    quantity: 1,
    paymentMethod: PAYMENT_METHODS.cash.value,
    status: PAYMENT_STATUS.paid.value,
    paymentDate: moment(),
    total: data?.price || 0,
  });
  const maxNumber = useMemo(() => data?.quantity || 0, [data]);
  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setInputValues(state => ({ ...state, [name]: value }));
  }, []);

  useEffect(() => {
    if (inputValues.product) {
      setInputValues(state => ({
        ...state,
        total: 1 * inputValues.price,
        quantity: 1,
      }));
    }
  }, [inputValues.product]);

  const handleProductSelect = value => {
    const product = products.find(i => i._id === value);
    setInputValues(state => ({
      ...state,
      product: value,
      price: product?.price || 0,
      total: product?.price * inputValues.quantity || 0,
    }));
  };

  const handleStatusChange = value => {
    setInputValues(state => ({ ...state, status: value }));
  };

  const handleQuantity = e => {
    const { value } = e.target;
    let maxNum = data.quantity;
    if (value > maxNum) {
      value = value.toString().slice(0, maxNum);
      setInputValues(state => ({
        ...state,
        quantity: parseInt(+value.toString().slice(0, maxNum)),
        total: inputValues.price * parseInt(+value.toString().slice(0, maxNum)),
      }));
    } else {
      setInputValues(state => ({
        ...state,
        quantity: +value,
        total: inputValues.price * +value,
      }));
    }
  };

  const handlePaymentMethod = value => {
    setInputValues(state => ({ ...state, paymentMethod: value }));
  };

  const fetchProducts = async () => {
    const { data } = await FETCH_PRODUCTS();
    if (data) {
      setProducts(data);
    }
  };

  const handleDateChange = (date, dateString) => {
    setInputValues(state => ({ ...state, paymentDate: date }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    let result = null;
    if (edit) {
      const { _id, status, ...rest } = inputValues;
      const updatedData = omitUpdateProps(rest);

      const respons = await UPDATE_SALE(data._id, {
        ...updatedData,
        price: +inputValues.price,
        status,
      });
      result = respons.data;
    } else {
      const response = await CREATE_SALE({
        ...inputValues,
        price: +inputValues.price,
      });

      result = response.data;
    }

    if (result) {
      message.success(t('Sale added successfully'));
      fetchData();
      hideModal();
    }
  };

  const { price, product, status, quantity, paymentMethod, paymentDate, total } = inputValues;

  return (
    <Modal
      title={t('Sell Product')}
      style={{ top: 20 }}
      visible={isVisible}
      okText={`${t('Total')} ${Number(total).toLocaleString()}`}
      cancelText={t('Cancel')}
      onOk={handleSubmit}
      centered
      onCancel={hideModal}
    >
      <Form
        name="basic"
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="on"
        layout="vertical"
      >
        <Form.Item label={t('Name')}>
          <Select
            value={product}
            name="product"
            style={{ width: '100%' }}
            onChange={handleProductSelect}
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {products.map(item => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t('Price')}>
          <Input readOnly type="number" name="price" value={price} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label={t('Quantity')}>
          <Input
            type="number"
            name="quantity"
            maxLength={data?.quantity}
            value={quantity?.toString()?.slice(0, data.quantity)}
            max={data?.quantity}
            onChange={handleQuantity}
          />
        </Form.Item>
        <Form.Item label={t('Payment date')}>
          <DatePicker name="paymentDate" value={paymentDate} onChange={handleDateChange} style={{ width: '100%' }} format={'DD.MM.YYYY'} showToday />
        </Form.Item>
        <Form.Item label={t('Payment Method')}>
          <Select value={paymentMethod} name="paymentMethod" style={{ width: '100%' }} onChange={handlePaymentMethod}>
            {Object.values(PAYMENT_METHODS).map(item => (
              <Option key={item.value} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t('Status')}>
          <Select value={status} name="status" style={{ width: '100%' }} onChange={handleStatusChange}>
            {Object.values(PAYMENT_STATUS).map(item => (
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

SaleAdd.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
