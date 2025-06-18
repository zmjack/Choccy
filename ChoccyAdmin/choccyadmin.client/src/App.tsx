import { Button, Col, Layout, Menu, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import LogoSVG from './assets/react.svg';
import { AppConfig } from './config/AppConfig';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppMenu,
  AppMenuBreadcrumb
} from './!framework/AppMenu';
import { AppRouterConfig } from './config/AppConfig';
import { ChoccyAdmin } from './!autogen/api';
import UserController = ChoccyAdmin.Server.Controllers.UserController;
import { TopMenu } from './!framework/TopMenu';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<UserController.UserProfile | undefined>();

  useEffect(() => {
    const userApi = new UserController();
    userApi.profile()
      .then(profile => {
        setProfile(profile);
      })
      .catch(err => {
        navigate(`/login?returnUrl=${location.pathname}`);
      });
  }, []);

  return <>
    {
      profile ? (
        <Layout>
          <Sider theme="light" collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
            <NavLink to="/">
              <div className="logo">
                <img src={LogoSVG} alt={AppConfig.appName} />
                <span className="app-name">{AppConfig.appName}</span>
              </div>
            </NavLink>

            <AppMenu
              profile={profile}
              config={AppRouterConfig}
              selectedKeys={[location.pathname]}
            />
          </Sider>

          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ paddingLeft: 0, paddingRight: 20, paddingTop: 14 }}>
              <TopMenu profile={profile} />
            </Header>

            <AppMenuBreadcrumb />

            <Content
              className="site-layout-background"
              style={{
                margin: '12px 16px',
                padding: 24,
                height: '100%',
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      ) : undefined
    }
  </>;
};

export default App;
