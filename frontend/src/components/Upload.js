import React, { useRef } from 'react';
import {Upload, message, Image, Button} from 'antd';
import {  LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { t } from '../utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';

const UPLOAD_URL = process.env.NODE_ENV === 'development'? 'http://localhost:5000/files': 'https://api.sparta-fitness.uz/files';
export default function UploadComponent({onChange, fileList, edit=false}) {
  const refInput = useRef(null);
  const myAccount = useSelector(state => state.account);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
    if (!isPNG) {
      message.error(t(`Only png or jpeg files are alloved`));
    }
    return isPNG || Upload.LIST_IGNORE;
  }

  const handleRemove = async(file) => {
    try {
      const filename = edit ? file.filename : file.response.data?.filename;
      const {data} = await axios.delete(`/files/${filename}`);
      setFile(null);
      onChange({
        imageUrl:null,
        file: null,
      });
      message.success(t('File deleted successfully'));
    } catch (error) {
      message.error(t('Error while deleting file'));
    }
  }

  const handleOnChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setFile(info.file);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        onChange({
          imageUrl,
          file: info.file?.response?.data,
        });
        setImageUrl(imageUrl);
        setLoading(false);
      })
    }
    setLoading(false);
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div style={{display: 'flex'}}>
      {
        fileList?.url && (
          <div>
            <Image 
              src={fileList.url} 
              width={102} 
              height={102} 
              style={{objectFit: 'cover', borderRadius: '6px'}}
            />
            <Button style={{marginTop: '10px'}} onClick={() => handleRemove(fileList)} danger>{t("Delete")}</Button>
          </div>
        )
      }
      
      <Upload
        listType='picture-card'
        name="files"
        beforeUpload={file => beforeUpload(file)}
        maxCount={1}
        ref={refInput}
        action={UPLOAD_URL}
        onChange={handleOnChange}
        onRemove={handleRemove}
        headers={{authorization: `Bearer ${myAccount.token}`}}
        progress={{
          strokeColor: {
            '0%': '#108ee9',
            '100%': '#87d068',
          },
          strokeWidth: 3,
          format: percent => `${parseFloat(percent.toFixed(2))}%`,
        }}
      >
        {!file && !fileList?.url? uploadButton:null}
      </Upload>
      
    </div>
  )
}