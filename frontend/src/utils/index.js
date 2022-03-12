import uz from '../lang/uz';
import ru from '../lang/ru';
import en from '../lang/en';
import store from '../redux';
import { STYLING_CONFIGS } from '../constants';
import { message } from 'antd';
import axios from './axios';
const dictionary = {
  ru,
  uz,
  en
}; 

export function t(str) {
  const lang = store.getState().account?.lang || 'uz';
  if (dictionary[lang][str]) {
    return dictionary[lang][str];
  }
  // return str + '-' + lang;
  return str;
}

export function pxToRem(size) {
  if (typeof size === 'number') {
    return `${Number(size / STYLING_CONFIGS.ROOT_SIZE)}rem`;
  }
  throw new Error('size is not a number. Type numbers only');
}

export const getErrorMessage = (error) => {
  if (error.response) {
    if (error.response.status === 401) {
      return t('You are not authorized');
    }
    if (error.response.status === 404) {
      return t('Resource not found');
    }
    if (error.response.status === 403) {
      return t('You are not authorized');
    }
    if (error.response.data) {
      return error.response.data.message;
    }
  }

  return error.message;
};

export const imgUploader = async(files) => {
  try {
    const formData = new FormData();
    formData.append("files", files);
    const uploadedImage = await axios.post("/files", formData);
    return uploadedImage.data.payload[0]._id;
  } catch (err) {
    message.error(t("Something wrong. Try again."));
  }
}


export const omitUpdateProps = (data) => {
  const {__v, _id, status, createdAt, updatedAt, isDeleted, deletedAt, ...omitedData} = data;
  return omitedData;
}

export const createTablePagination = (total, pageSize) => {
  const options = ['10', '20', '30', '40', '50', '100' ].filter(item => item < pageSize);
  return {
    total,
    hideOnSinglePage: true,
    pageSize: pageSize || STYLING_CONFIGS.TABLE_PAGE_SIZE,
    showSizeChanger: total > STYLING_CONFIGS.TABLE_PAGE_SIZE,
    pageSizeOptions: options.concat(total),
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  }
}