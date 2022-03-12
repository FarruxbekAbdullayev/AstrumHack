import { message } from 'antd';
import queryString from 'query-string';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE_PAYMENT = async (payment) => {
  try {
    const { data } = await axios.post('/payments', payment);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_STATISTICS = async (filter) => {
  try {
    const filters = queryString.stringify(filter);
    const { data } = await axios.get(`/payments/statistics?${filters}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_PAYMENTS = async (filter) => {
  try {
    const filters = queryString.stringify({...filter,});
    const { data } = await axios.get(`/payments/?${filters}`);
    return data;
  } catch (error) {
    message.error(getErrorMessage(error));
  }
};

export const DELETE_PAYMENT = async (id) => {
  try {
    const { data } = await axios.delete(`/payments/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const UPDATE_PAYMENT = async (id, products) => {
  try {
    const { data } = await axios.put(`/payments/${id}`, products);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
