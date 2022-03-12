import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { StyledSignUp } from './Auth.style';
import { updateAccount } from '../../redux/auth/reducer';
import { useDispatch } from 'react-redux';
import { SIGN_IN } from '../../services/auth.service';
import { t } from '../../utils';
import BgImage from '../../assets/images/sidebar/bg.jpg';

export default function SignIn() {
  const [inputValues, setInputValues] = useState({
    password: null,
    email: '',
  });
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    const userData = await SIGN_IN(inputValues);
    if (userData) {
      dispatch(updateAccount({ token: null, ...userData.payload }));
    }
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
          label={t('Email')}
          rules={[
            {
              required: true,
              message: t('Please input your email!'),
            },
          ]}
        >
          <Input size="large" name="email" value={inputValues.email} onChange={handleInputChange} />
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
          <Button onClick={handleSubmit} type="primary" htmlType="submit">
            {t('Sign In')}
          </Button>
        </Form.Item>
      </Form>
    </StyledSignUp>
  );
}