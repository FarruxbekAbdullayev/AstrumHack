import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { StyledSignUp } from './Auth.style';
import { updateAccount } from '../../redux/auth/reducer';
import { useDispatch } from 'react-redux';
import { SIGN_UP } from '../../services/auth.service';
import { t } from '../../utils';
import BgImage from '../../assets/images/sidebar/bg.jpg'

export default function SignUp() {
  const [inputValues, setInputValues] = useState({
    password: null,
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    email: '',
  });
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const userData = await SIGN_UP(inputValues);
    if(userData) {
      const { token, data } = userData;
      dispatch(updateAccount({token, ...data}));
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if(name === 'phone' && value.length === 14) {
      return
    };
    
    setInputValues((state) => ({ ...state, [name]: value }));
  }, []);

  return (
    <StyledSignUp bg={BgImage}>
      <Form
        name="basic"
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 16
        }}
        initialValues={{
          remember: true
        }}
        layout="vertical"
        autoComplete="off"
      >
        <h1>{t('Sign Up')}</h1>
        <Form.Item
          label={t("First Name")}
          rules={[
            {
              required: true,
              message: t('Please input your first name!')
            }
          ]}
        >
          <Input
            size="large"
            name="firstName"
            value={inputValues.firstName}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label={t("Last Name")}>
          <Input
            size="large"
            name="lastName"
            value={inputValues.lastName}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label={t("Address")}>
          <Input
            size="large"
            name="address"
            value={inputValues.address}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          label={t('Phone')}
          rules={[
            {
              required: true,
              message: t('Please input your phone!')
            }
          ]}
        >
          <Input 
            autoComplete="new-password"
            size="large" 
            name="phone" 
            value={inputValues.phone} 
            onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item
          label={t('Email')}
          rules={[
            {
              required: true,
              message: t('Please input your email!')
            }
          ]}
        >
          <Input 
            autoComplete="new-password"
            size="large" 
            name="email" 
            value={inputValues.email} 
            onChange={handleInputChange} 
          />
        </Form.Item>
        <Form.Item
          label={t('Password')}
          rules={[
            {
              required: true,
              message: t('Please input your password!')
            }
          ]}
        >
          <Input.Password
            name="password"
            value={inputValues.password}
            onChange={handleInputChange}
            autoComplete="new-password"
            size="large"
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16
          }}
        >
          <Button onClick={handleSubmit} type="primary" htmlType="submit">
            {t('Sign Up')}
          </Button>
          <p>
           <span style={{color: 'white'}}>{t('Do you have an account ?')}</span> <Link to="/sign-in">{t('Sign In')}</Link>
          </p>
        </Form.Item>
      </Form>
    </StyledSignUp>
  );
}
