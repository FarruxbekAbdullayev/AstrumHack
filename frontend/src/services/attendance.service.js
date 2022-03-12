import { message } from 'antd';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE_ATTANDANCE = async (attendance) => {
  try {
    const { data } = await axios.post('/attendance/add-attendance', attendance);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const CREATE_ATTANDANCE_WITH_QRCODE = async (userId) => {
  try {
    const { data } = await axios.post('/attendance/add-attendance', {userId});
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_ATTANDANCE = async () => {
  try {
    const { data } = await axios.get('/attendance/');
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const DELETE_ATTANDANCE = async (id) => {
  try {
    const { data } = await axios.post(`/attendance/${id}/delete`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const UPDATE_ATTANDANCE = async (id, userData) => {
  try {
    const { data } = await axios.post(`/attendance/${id}/edit`, userData);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};