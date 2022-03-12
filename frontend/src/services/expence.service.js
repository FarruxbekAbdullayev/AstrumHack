import { message } from 'antd';
import queryString from 'query-string';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE_EXPENCE = async (expence) => {
  try {
    const { data } = await axios.post('/expenses', expence);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_EXPENCES = async (filter) => {
  try {
    const filters = queryString.stringify(filter);
    const { data } = await axios.get(`/expenses?${filters}`);

    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const DELETE_EXPENCE = async (id) => {
  try {
    const { data } = await axios.delete(`/expenses/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const UPDATE_EXPENCE = async (id, expences) => {
  try {
    const { data } = await axios.put(`/expenses/${id}`, expences);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
