import { message } from 'antd';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE_ATTANDANCE = async (attendance) => {
  try {
    const { data } = await axios.post('/attendances', attendance);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const CREATE_EQUIPMENT_ATTANDANCE = async (attendance) => {
  try {
    const { data } = await axios.post('/inventory-attendance', attendance);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const CREATE_ATTANDANCE_WITH_QRCODE = async (userId) => {
  try {
    const { data } = await axios.post('/attendances/qrcode-scanner', {userId});
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_ATTANDANCE = async () => {
  try {
    const { data } = await axios.get('/attendances');
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_EQUIPMENT_ATTANDANCE_BY_ID = async (id) => {
  try {
    const { data } = await axios.get('/inventory-attendance/'+id);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const DELETE_ATTANDANCE = async (id) => {
  try {
    const { data } = await axios.delete(`/attendances/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const DELETE_EQUIPMENT_ATTANDANCE = async (id) => {
  try {
    const { data } = await axios.delete(`/inventory-attendance/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const UPDATE_ATTANDANCE = async (id, userData) => {
  try {
    const { data } = await axios.put(`/attendances/${id}`, userData);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};