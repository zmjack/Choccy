import {
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { createRouterConfig, RouterConfig } from '../!autogen/Router';
import Home from '../pages/Home';
import WeatherAdminPanel from '../pages/WeatherAdminPanel';
import WeatherAnyPanel from '../pages/WeatherAnyPanel';
import WeatherUserPanel from '../pages/WeatherUserPanel';

export const AppConfig =
{
  appName: "ChoccyAdmin"
};

export const AppRouterConfig: RouterConfig = createRouterConfig({
  '/': {
    label: 'Home',
    icon: <VideoCameraOutlined />,
    element: <Home />
  },
  '/weather': {
    label: 'Weather',
    icon: <UploadOutlined />
  },
  '/weather/admin': {
    label: 'Admin',
    element: <WeatherAdminPanel />
  },
  '/weather/user': {
    label: 'User',
    element: <WeatherUserPanel />
  },
  '/weather/any': {
    label: 'Any',
    element: <WeatherAnyPanel />
  },
});
