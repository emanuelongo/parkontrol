import { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Spin } from 'antd';
import {
  CarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { vistasApi, type OcupacionParqueadero } from '../api/vistas';
import { reservasApi } from '../api/reservas';
import type { Reserva } from '../types';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [ocupacion, setOcupacion] = useState<OcupacionParqueadero[]>([]);
  const [reservasActivas, setReservasActivas] = useState<Reserva[]>([]);

  const idEmpresa = 1;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Intentar cargar ocupación, pero no fallar si hay error
      try {
        const ocupacionData = await vistasApi.getOcupacion(idEmpresa);
        setOcupacion(ocupacionData);
      } catch (ocupacionError) {
        console.warn('No se pudo cargar datos de ocupación (puede que falte la vista en BD):', ocupacionError);
        setOcupacion([]);
      }
      
      // Cargar reservas activas
      const reservasData = await reservasApi.getActivas();
      setReservasActivas(reservasData);
      
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      // El error ya se muestra por el interceptor
    } finally {
      setLoading(false);
    }
  };

  const totalParqueaderos = ocupacion.length;
  const totalCeldasOcupadas = ocupacion.reduce((acc, p) => acc + p.celdasOcupadas, 0);
  const totalReservasActivas = reservasActivas.length;
  const ingresosHoy = 0; // Calcular desde la API de ingresos si es necesario

  const columns = [
    {
      title: 'Parqueadero',
      dataIndex: 'nombreParqueadero',
      key: 'nombreParqueadero',
    },
    {
      title: 'Capacidad',
      dataIndex: 'capacidadTotal',
      key: 'capacidadTotal',
    },
    {
      title: 'Ocupadas',
      dataIndex: 'celdasOcupadas',
      key: 'celdasOcupadas',
    },
    {
      title: 'Disponibles',
      dataIndex: 'celdasDisponibles',
      key: 'celdasDisponibles',
    },
    {
      title: 'Ocupación',
      dataIndex: 'porcentajeOcupacion',
      key: 'porcentajeOcupacion',
      render: (value: number) => `${value.toFixed(1)}%`,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Parqueaderos Activos"
              value={totalParqueaderos}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Celdas Ocupadas"
              value={totalCeldasOcupadas}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Reservas Activas"
              value={totalReservasActivas}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ingresos Hoy"
              value={ingresosHoy}
              prefix="$"
              suffix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Ocupación de Parqueaderos">
        <Table
          columns={columns}
          dataSource={ocupacion}
          rowKey={(record) => `parqueadero-${record.idParqueadero}`}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
