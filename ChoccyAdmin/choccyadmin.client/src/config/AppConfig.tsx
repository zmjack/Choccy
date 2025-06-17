import {
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import Home from '../pages/Home';
import Users from '../pages/Users';
import Users2 from '../pages/Users2';
import { createRouterConfig, RouterConfig } from '../!autogen/Router';
import WeatherForecastPanel from '../pages/WeatherForecastPanel';

export const AppConfig =
{
  appName: "Web Binary"
};

export const AppRouterConfig: RouterConfig = createRouterConfig({
  '/': {
    label: 'Home',
    icon: <VideoCameraOutlined />,
    element: <Home />
  },
  '/c/weather-1': {
    label: 'contract',
    element: <Users />
  },
  '/c/weather-2': {
    label: 'contract-c1',
    element: <WeatherForecastPanel />
  },
  '/c': {
    label: '13',
    icon: <UploadOutlined />,
  },
  '/c2': {
    label: 'c2',
  },
  '/c2/weather-1': {
    label: '1344',
    element: <Users2 />
  }
});
