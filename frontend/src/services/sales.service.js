import { message } from 'antd';
import queryString from 'query-string';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE_SALE = async (sale) => {
  try {
    const { data } = await axios.post('/sales', sale);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_SALES = async (filter) => {
  try {
    const filters = queryString.stringify(filter);
    const { data } = await axios.get(`/sales?${filters}`);

    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const DELETE_SALE = async (id) => {
  try {
    const { data } = await axios.delete(`/sales/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const UPDATE_SALE = async (id, sales) => {
  try {
    const { data } = await axios.put(`/sales/${id}`, sales);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
