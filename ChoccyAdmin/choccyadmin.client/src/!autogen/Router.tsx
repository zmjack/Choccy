import { ReactNode } from "react";
import { RouteObject } from "react-router-dom";
import App from '../App'
import LoginApp from '../LoginApp';

export type RouteElement = {
  label: string,
  icon?: ReactNode,
  element?: ReactNode,
  order?: number,
  access?: string
}
export type RouterConfig = {
  '/': RouteElement,
  '/weather': RouteElement,
  '/weather/admin': RouteElement,
  '/weather/any': RouteElement,
  '/weather/user': RouteElement
} & Record<string, RouteElement>;

export type RouteItem = RouteObject & {
  order?: number,
  access?: string,
  children?: RouteItem[]
};

export function getRoutes(config: RouterConfig): RouteItem[] {
  function sort(a: RouteItem, b: RouteItem): number {
    return a.order! - b.order!;
  }
  return [{
    path: '/',
    element: <App />,
    children: [{
      path: '',
      order: config['/'].order,
      element: config['/'].element,
      access: ''
    }, {
      path: 'weather',
      order: config['/weather'].order,
      children: [{
        path: 'admin',
        order: config['/weather/admin'].order,
        element: config['/weather/admin'].element,
        access: 'Admin'
      }, {
        path: 'any',
        order: config['/weather/any'].order,
        element: config['/weather/any'].element
      }, {
        path: 'user',
        order: config['/weather/user'].order,
        element: config['/weather/user'].element,
        access: 'User'
      }].sort(sort)
    }].sort(sort)
  }, {
    path: '/login',
    element: <LoginApp />
  }]
};

export function createRouterConfig(config: RouterConfig): RouterConfig {
  const keys = Object.keys(config);
  let i = 0;
  for (let key of keys) {
    config[key].order = i++;
  }
  return config;
}
