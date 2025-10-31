import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  TagOutlined,
  FileTextOutlined,
  BarChartOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/parqueaderos',
      icon: <DatabaseOutlined />,
      label: 'Parqueaderos',
    },
    {
      key: '/celdas',
      icon: <AppstoreOutlined />,
      label: 'Celdas',
    },
    {
      key: '/vehiculos',
      icon: <CarOutlined />,
      label: 'Vehiculos',
    },
    {
      key: '/reservas',
      icon: <ClockCircleOutlined />,
      label: 'Reservas',
    },
    {
      key: '/pagos',
      icon: <DollarOutlined />,
      label: 'Pagos',
    },
    {
      key: '/usuarios',
      icon: <UserOutlined />,
      label: 'Usuarios',
    },
    {
      key: '/tarifas',
      icon: <TagOutlined />,
      label: 'Tarifas',
    },
    {
      key: '/facturacion',
      icon: <FileTextOutlined />,
      label: 'Facturacion',
    },
    {
      key: '/reportes',
      icon: <BarChartOutlined />,
      label: 'Reportes',
    },
    {
      key: '/vistas',
      icon: <EyeOutlined />,
      label: 'Vistas Oracle',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            color: 'white',
            fontSize: collapsed ? 18 : 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {collapsed ? 'PK' : 'Parkontrol'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer }}>
          <h2 style={{ margin: 0 }}>Sistema de Gestión de Parqueaderos</h2>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
