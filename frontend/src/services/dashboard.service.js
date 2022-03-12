import { message } from 'antd';
import axios from '../utils/axios';
import { getErrorMessage } from '../utils';
import queryString from 'query-string';

export const FETCH_DASHBOARD = async (filter) => {
  try {
    const filters = queryString.stringify(filter);
    const { data } = await axios.get(`/dashboard?${filters}`);

    return data;
  } catch (error) {
    console.log(error);
    message.error(getErrorMessage(error));
  }
};