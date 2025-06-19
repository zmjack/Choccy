import { ChoccyAdmin } from '../!autogen/api';
import { Alert, Col, Dropdown, MenuProps, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import UserProfile = ChoccyAdmin.Server.Controllers.UserController.UserProfile;

export function TopMenu(props: {
  profile: UserProfile,
}) {
  const items: MenuProps['items'] = useMemo(() => [{
    type: 'divider',
  }, {
    label: (
      <a href="/Account/Logout">
        退出登录
      </a>
    ),
    key: 'logout',
  }], [props.profile]);

  return (
    <Row>
      <Col flex="auto">
        <Alert
          message="无重要通知"
          banner
          closable
        />
      </Col>
      <Col flex="100px">
        <Dropdown.Button
          menu={{ items }}
          style={{ marginLeft: 20, marginTop: 4 }}
        >
          <UserOutlined />
          {props.profile.userName}
        </Dropdown.Button>
      </Col>
    </Row>
  );
}