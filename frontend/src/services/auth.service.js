import { message } from 'antd';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const SIGN_UP = async attendance => {
  try {
    const { data } = await axios.post('/signup', attendance);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const SIGN_IN = async user => {
  try {
    const { data } = await axios.post('/login', user);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const FORGOT_PASSWORD = async user => {
  try {
    const { data } = await axios.post('/forgot-password', user);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const CHECK_PASSWORD = async user => {
  try {
    const { data } = await axios.post('/check-password', user);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const NEW_PASSWORD = async user => {
  try {
    const { data } = await axios.post('/new-password', user);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const SIGN_OUT = async id => {
  try {
    const { data } = await axios.delete(`/attendances/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const UPDATE_ACCOUNT = async (id, userData) => {
  try {
    const { data } = await axios.put(`/attendances/${id}`, userData);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
