import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { StyledSignUp } from './Auth.style';
import { updateAccount } from '../../redux/auth/reducer';
import { useDispatch } from 'react-redux';
import { CHECK_PASSWORD, FORGOT_PASSWORD, NEW_PASSWORD, SIGN_IN } from '../../services/auth.service';
import { Link } from 'react-router-dom';
import { t } from '../../utils';
import BgImage from '../../assets/images/sidebar/bg.jpg';

export default function SignIn() {
  const [inputValues, setInputValues] = useState({
    password: null,
    phone: '',
  });
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    const userData = await SIGN_IN(inputValues);

    if (userData) {
      const { token, data } = userData;
      dispatch(updateAccount({ token, ...data }));
    }
  };
  const handlePassword = async () => {
    // const userData = await FORGOT_PASSWORD({
    //   email: 'sanjarbekweb@gmail.com',
    // });
    // const userData = await CHECK_PASSWORD({
    //   passwordRecovery: "Z87JY6",
    // });
    // const userData = await NEW_PASSWORD({
    //   token:
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBmNjVkYWJkMTk5ZjAyODFlOTQxMGQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NDUxODUyOTAsImV4cCI6MTY0NTE4NjE5MH0.bD6gJRHJkZX-OoKEu0Zc0RNN5CkaOLgJsNjJM3yydto',
    //   password: '123456',
    // });
    // console.log(userData, 'handlePassword', 'enter email and security code');
  };
  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    if (name === 'phone' && value.length === 14) {
      return;
    }

    setInputValues(state => ({ ...state, [name]: value }));
  }, []);

  return (
    <StyledSignUp bg={BgImage}>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        autoComplete="off"
      >
        <h1>{t("Sign In")}</h1>
        <Form.Item
          label={t('Phone')}
          rules={[
            {
              required: true,
              message: t('Please input your phone!'),
            },
          ]}
        >
          <Input size="large" name="phone" value={inputValues.phone} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item
          label={t('Password')}
          rules={[
            {
              required: true,
              message: t('Please input your password!'),
            },
          ]}
        >
          <Input.Password name="password" size="large" value={inputValues.password} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="link" onClick={handlePassword}>
            {t('Forgot password?')}
          </Button>
          <Button onClick={handleSubmit} type="primary" htmlType="submit">
            {t('Sign In')}
          </Button>
        </Form.Item>
      </Form>
    </StyledSignUp>
  );
}