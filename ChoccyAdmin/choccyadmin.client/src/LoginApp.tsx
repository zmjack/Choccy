import { Button, Card, Checkbox, Form, Input, Tabs } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import LogoSVG from './assets/logo.svg';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { StarrySky } from './!framework/StarrySky';
import { WindowEvent } from './!framework/WindowEvent';
import { AppConfig } from './config/AppConfig';
import { useLocation } from 'react-router-dom';
import { ChoccyAdmin } from './!autogen/api';
import LoginError = ChoccyAdmin.Server.Controllers.AccountController.LoginError;

const LoginApp: React.FC = () => {
  const location = useLocation();
  const err = useMemo(() => new URLSearchParams(location.search).get('err'), [location]);

  const form = useRef<HTMLFormElement>(null);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [bgWidth, setBgWidth] = useState(window.innerWidth);
  const [bgHeight, setBgHeight] = useState(window.innerHeight);
  const [stars, setStars] = useState(1000);
  const [hue, setHue] = useState(222);

  useEffect(() => {
    document.getElementById('userName')?.focus();
  }, []);

  return <div style={{ width: '100%', height: '100%' }}>
    <div className="login-background">
      <WindowEvent onResize={() => {
        setBgWidth(window.innerWidth);
        setBgHeight(window.innerHeight);
      }} />
      <StarrySky width={bgWidth} height={bgHeight} stars={stars} hue={hue}></StarrySky>
    </div>
    <div className="login-background-light" style={{ left: -300 }}></div>

    <div className="form-login-main">
      <div className="login-logo">
        <img src={LogoSVG} height="60" alt="" />
      </div>

      <form ref={form} method="post" action={`/Account/Login${location.search}`} style={{ display: 'none' }}>
        <input type="text" name="userName" value={userName} readOnly />
        <input type="text" name="password" value={password} readOnly />
      </form>

      <Card className="login-card">
        <Form
          autoComplete="off"
          onFinish={() => form.current?.submit()}
        >
          <Form.Item>
            <div className="login-text">
              {AppConfig.appName}
            </div>
            <div className="login-err-text">
              {err == LoginError.Fail.toString() ? <span style={{ color: 'red' }}>登录失败</span> : ''}
            </div>
          </Form.Item>

          <Form.Item
            name="userName"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              name="userName"
              size="large"
              prefix={<UserOutlined style={{ marginRight: 6 }} />}
              placeholder="用户名"
              onChange={e => setUserName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              name="password"
              size="large"
              prefix={<LockOutlined style={{ marginRight: 6 }} />}
              placeholder="密码"
              onChange={e => setPassword(e.target.value)}
            />
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

      <Card size="small" className="login-card">
        <div className="login-version">
          Powered by ChoccyAdmin v1.0.0
        </div>
      </Card>

      {/*<Card size="small" className="login-card">*/}
      {/*  <div className="login-version">*/}
      {/*    DEBUG*/}
      {/*  </div>*/}
      {/*  <input type="number" step="100" value={stars} onChange={e => setStars(parseInt(e.target.value))} />*/}
      {/*  <input type="number" step="1" value={hue} onChange={e => setHue(parseInt(e.target.value))} />*/}
      {/*</Card>*/}

    </div >
  </div >;
};

export default LoginApp;