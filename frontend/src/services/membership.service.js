import { message } from 'antd';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE_MEMBERSHIP = async (mebership) => {
  try {
    const { data } = await axios.post('/membership', mebership);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_MEMBERSHIP = async () => {
  try {
    const { data } = await axios.get('/membership');
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const DELETE_MEMBERSHIP = async (id) => {
  try {
    const { data } = await axios.delete(`/membership/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
export const UPDATE_MEMBERSHIP = async (id, membership) => {
  try {
    const { data } = await axios.put(`/membership/${id}`, membership);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
