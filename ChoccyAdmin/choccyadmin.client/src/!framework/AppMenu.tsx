import {
  HomeOutlined,
} from '@ant-design/icons';
import { NavLink, RouteObject, useLocation } from "react-router-dom";
import { RouterItem, RouterConfig, getRoutes } from "../!autogen/Router";
import { Breadcrumb, Menu } from 'antd';
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { AppRouterConfig } from '../config/AppConfig';
import { useEffect, useMemo, useState } from 'react';

function parse(items: RouterConfig, router: RouteObject, base?: string): ItemType<MenuItemType> {
  if (!base) base = '';

  let key: string;
  if (router.path?.startsWith('/')) {
    key = router.path;
  } else {
    if (base?.endsWith('/')) key = `${base}${router.path}`;
    else key = `${base}/${router.path}`
  }

  const item = items[key] as RouterItem;
  return {
    key,
    label: router.children ? item?.label : <NavLink to={key}>{item?.label}</NavLink>,
    icon: item?.icon,
    children: router.children?.map(r => parse(items, r, key)).filter(x => x)
  }
};

function getOpenKeys(path: string): string[] {
  const parts = path.slice(1).split('/');
  const dirs = parts.slice(0, parts.length - 1);

  function* iterate() {
    let prev = '';
    for (let dir of dirs) {
      yield `${prev}/${dir}`;
      prev = dir;
    }
  }

  const list = [];
  const it = iterate();
  let result = it.next();
  while (!result.done) {
    list.push(result.value);
    result = it.next();
  }

  return list;
}

export function AppMenu(props: {
  config: RouterConfig,
  selectedKeys: [string],
  onSelect?: (key: string, item: RouterItem) => void
}) {
  const { selectedKeys, config } = props;

  const items = useMemo<ItemType<MenuItemType>[]>(() => {
    const routes = getRoutes(AppRouterConfig);
    const items = routes?.[0].children?.map(r => parse(config, r)).filter(x => x)!;
    return items;
  }, [AppRouterConfig])

  const [openKeys, setOpenKeys] = useState<string[]>();
  useEffect(() => setOpenKeys(getOpenKeys(selectedKeys[0])), [selectedKeys]);

  return <>
    <Menu
      theme="light"
      mode="inline"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      items={items}
      onSelect={item => {
        props.onSelect?.(item.key, config[item.key]);
      }}
      onOpenChange={keys => setOpenKeys(keys)}
    />
  </>;
}

export function AppMenuBreadcrumb(props: {
  onClick?: (key: string) => void
}) {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const key = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const item = AppRouterConfig[key];
    return (
      <Breadcrumb.Item
        key={key}
        onClick={e => props.onClick?.(key)}
      >
        {/*<NavLink to={key}>{item.label}</NavLink>*/}
        {item.label}
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="/">
      <NavLink to="/">
        <HomeOutlined />
      </NavLink>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return <>
    <Breadcrumb
      style={{
        margin: '12px 16px 0',
      }}
    >
      {breadcrumbItems}
    </Breadcrumb>
  </>;
}
