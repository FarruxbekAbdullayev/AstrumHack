import { message } from 'antd';
import axios from '../utils/axios';
import {getErrorMessage} from '../utils';

export const CREATE_EQUIPMENT = async (equipment) => {
  try {
    const { data } = await axios.post('/inventory', equipment);
    return data;
  } catch (error) {
    console.log(error);
    message.error(error.message);
  }
}

export const FETCH_EQUIPMENT = async () => {
  try {
    const { data } = await axios.get('/inventory');
    return data;
  } catch (error) {
    console.log(error);
    message.error(error.message);
  }
}

export const FETCH_EQUIPMENT_ATTENDANCE = async () => {
  try {
    const { data } = await axios.get('/inventory-attendance');
    return data;
  } catch (error) {
    console.log(error);
    message.error(error.message);
  }
}

export const DELETE_EQUIPMENT = async (id) => {
  try {
    const { data } = await axios.delete(`/inventory/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
}

export const UPDATE_EQUIPMENT = async (id, equipment) => {
  try {
    const { data } = await axios.put(`/inventory/${id}`, equipment);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
}
