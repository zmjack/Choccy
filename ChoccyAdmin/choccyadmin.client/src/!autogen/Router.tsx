import App from '../App'
import { ReactNode } from "react";
import { RouteObject } from "react-router-dom";

export type RouterItem = {
  label: string,
  icon?: ReactNode,
  element?: ReactNode,
  order?: number,
}
export type RouterConfig = {
  '/': RouterItem,
  '/c': RouterItem,
  '/c/weather-2': RouterItem,
  '/c/weather-1': RouterItem,
  '/c2': RouterItem,
  '/c2/weather-1': RouterItem
} & Record<string, RouterItem>;

type Item = RouteObject & { order?: number };

export function getRoutes(config: RouterConfig): Item[] {
  function sort(a: Item, b: Item): number {
    return a.order! - b.order!;
  }
  return [{
    path: '/',
    element: <App />,
    children: [{
      path: '',
      order: config['/'].order,
      element: config['/'].element,
      access: 'default'
    }, {
      path: 'c',
      order: config['/c'].order,
      children: [{
        path: 'weather-2',
        order: config['/c/weather-2'].order,
        element: config['/c/weather-2'].element,
        access: 'default'
      }, {
        path: 'weather-1',
        order: config['/c/weather-1'].order,
        element: config['/c/weather-1'].element,
        access: 'Admin'
      }].sort(sort)
    }, {
      path: 'c2',
      order: config['/c2'].order,
      children: [{
        path: 'weather-1',
        order: config['/c2/weather-1'].order,
        element: config['/c2/weather-1'].element,
        access: 'default'
      }].sort(sort)
    }].sort(sort)
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
