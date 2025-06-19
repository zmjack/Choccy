import { ReactNode } from "react";
import { RouteObject } from "react-router-dom";
import App from '../App'
import LoginApp from '../LoginApp';

export type RouteElement = {
  label: string,
  icon?: ReactNode,
  element?: ReactNode
}
export type RouterConfig = {
  '/': RouteElement,
  '/weather': RouteElement,
  '/weather/admin': RouteElement,
  '/weather/any': RouteElement,
  '/weather/user': RouteElement
};

export type RouteItem = {
  path: string | undefined;
  element?: React.ReactNode | undefined,
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
      order: (config['/'] as any).order,
      element: config['/'].element,
      access: ''
    }, {
      path: 'weather',
      order: (config['/weather'] as any).order,
      children: [{
        path: 'admin',
        order: (config['/weather/admin'] as any).order,
        element: config['/weather/admin'].element,
        access: 'Admin'
      }, {
        path: 'any',
        order: (config['/weather/any'] as any).order,
        element: config['/weather/any'].element
      }, {
        path: 'user',
        order: (config['/weather/user'] as any).order,
        element: config['/weather/user'].element,
        access: 'User'
      }].sort(sort)
    }].sort(sort)
  }, {
    path: '/login',
    element: <LoginApp />
  }]
};

export function getRouteObjects(config: RouterConfig): RouteObject[] {
  function parse(route: RouteItem): RouteObject {
    return {
      path: route.path,
      element: route.element,
      children: route.children?.map(parse)
    } satisfies RouteObject;
  }
  const routes = getRoutes(config);
  return routes.map(parse);
}

export function createRouterConfig(config: RouterConfig): RouterConfig {
  const keys = Object.keys(config);
  let i = 0;
  for (let key of keys) {
    (config as any)[key].order = i++;
  }
  return config;
}
