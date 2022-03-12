import { message } from 'antd';
import queryString from 'query-string';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE_PRODUCT = async (mebership) => {
  try {
    const { data } = await axios.post('/products', mebership);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_PRODUCTS = async () => {
  try {
    const query = queryString.parse(window.location.search);
    console.log('query',query)
    const { data } = await axios.get('/products');
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const DELETE_PRODUCT = async (id) => {
  try {
    const { data } = await axios.delete(`/products/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const UPDATE_PRODUCT = async (id, products) => {
  try {
    const { data } = await axios.put(`/products/${id}`, products);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
