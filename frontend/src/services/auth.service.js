import { message } from 'antd';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const SIGN_UP = async attendance => {
  try {
    const { data } = await axios.post('/auth/sign-up', attendance);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const SIGN_IN = async user => {
  try {
    const { data } = await axios.post('/auth/sign-in', user);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};
