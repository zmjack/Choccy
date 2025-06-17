import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import LogoSVG from './assets/react.svg';
import { AppConfig } from './config/AppConfig';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppMenu,
  AppMenuBreadcrumb
} from './!framework/AppMenu';
import { AppRouterConfig } from './config/AppConfig';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return <>
    <Layout>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <NavLink to="/">
          <div className="logo">
            <img src={LogoSVG} alt={AppConfig.appName} />
            <span className="app-name">{AppConfig.appName}</span>
          </div>
        </NavLink>

        <AppMenu
          config={AppRouterConfig}
          selectedKeys={[location.pathname]}
        />
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={new Array(3).fill(null).map((_, index) => ({
              key: String(index + 1),
              label: `nav ${index + 1}`,
            }))}
          />
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
  </>;
};

export default App;