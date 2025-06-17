import { Button, Card, Checkbox, Form, Input, Layout, Menu, Tabs } from 'antd';
import React, { useState } from 'react';
import LogoSVG from './assets/logo.svg';
import { UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const LoginApp: React.FC = () => {
  return <div style={{ width: '100%', height: '100%' }}>
    <div
      className="login-background"
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        left: -200
      }}
    ></div>
    <div className="form-login-main">
      <div style={{ height: 120 }}></div>
      <div className="login-logo">
        <img src={LogoSVG} height="60" alt="" />
      </div>
      <Tabs centered>
        <Tabs.TabPane tab="帐号密码登录">
          <Card className="login-card">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox> 自动登录 </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  style={{ width: '100%' }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  </div >;
};

export default LoginApp;