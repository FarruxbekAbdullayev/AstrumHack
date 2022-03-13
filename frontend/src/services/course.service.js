import { message } from 'antd';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';

export const CREATE__COURSE = async course => {
  try {
    const { data } = await axios.post('/courses/add-course', course);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const FETCH_COURSES = async course => {
  try {
    const { data } = await axios.get('/courses', course);
    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};

export const DELETE_COURSE = async (id) => {
    try {
      const { data } = await axios.post(`/courses/${id}/delete`);
      return data;
    } catch (error) {
      console.log(error);
      message.error(getErrorMessage(error));
    }
  };
  
  export const UPDATE_COURSE = async (id, user) => {
    try {
      const { data } = await axios.post(`/courses/${id}/edit`, user);
      return data;
    } catch (error) {
      console.log(error);
      message.error(getErrorMessage(error));
    }
  };
  