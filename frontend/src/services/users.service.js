import { message } from 'antd';
import { getErrorMessage } from '../utils';
import axios from '../utils/axios';

export const CREATE_USER = async (mebership) => {
  try {
    const { data } = await axios.post('/users/add-user', mebership);
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};

export const FETCH_USER = async () => {
  try {
    const { data } = await axios.get('/users');
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};

export const FETCH_STUFF = async () => {
  try {
    const { data } = await axios.get('/users?role=reception,trainer');
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};

export const FETCH_ADMINS = async () => {
  try {
    const { data } = await axios.get('/users?role=admin,reception');
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};

export const FETCH_TRAINERS = async () => {
  try {
    const { data } = await axios.get('/users?role=trainer');
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};

export const FETCH_USER_DETAILS = async (id) => {
  try {
    const { data } = await axios.get(`/users/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};

export const DELETE_USER = async (id) => {
  try {
    const { data } = await axios.post(`/users/${id}/delete`);
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};

export const UPDATE_USER = async (id, user) => {
  try {
    const { data } = await axios.post(`/users/${id}/edit`, user);
    return data;
  } catch (error) {
    console.log(error);
    // message.error(getErrorMessage(error));
  }
};
