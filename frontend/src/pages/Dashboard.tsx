import { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Select, Spin } from 'antd';
import {
  CarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { vistasApi, type OcupacionParqueadero } from '../api/vistas';
import { reservasApi } from '../api/reservas';
import type { Reserva } from '../types';
import { useEmpresas } from '../hooks/useEmpresas';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [ocupacion, setOcupacion] = useState<OcupacionParqueadero[]>([]);
  const [reservasActivas, setReservasActivas] = useState<Reserva[]>([]);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [facturacion, setFacturacion] = useState<any[]>([]);
  const [idEmpresa, setIdEmpresa] = useState<number | undefined>();
  
  const { empresas, loading: loadingEmpresas } = useEmpresas();

  // Set first empresa as default when loaded
  useEffect(() => {
    if (empresas.length > 0 && idEmpresa === undefined) {
      setIdEmpresa(empresas[0].id);
    }
  }, [empresas, idEmpresa]);

  useEffect(() => {
    fetchDashboardData();
  }, [idEmpresa]);

  const fetchDashboardData = async () => {
    if (!idEmpresa) return;
    
    setLoading(true);
    try {
      // Cargar ocupación
      try {
        const ocupacionData = await vistasApi.getOcupacion(idEmpresa);
        setOcupacion(ocupacionData);
      } catch (ocupacionError) {
        console.warn('No se pudo cargar datos de ocupacion:', ocupacionError);
        setOcupacion([]);
      }
      
      // Cargar reservas activas
      try {
        const reservasData = await reservasApi.getActivas();
        setReservasActivas(reservasData);
      } catch (error) {
        console.warn('No se pudo cargar reservas:', error);
        setReservasActivas([]);
      }

      // Cargar ingresos mensuales
      try {
        const ingresosData = await vistasApi.getIngresos(idEmpresa);
        setIngresos(ingresosData);
      } catch (error) {
        console.warn('No se pudo cargar ingresos:', error);
        setIngresos([]);
      }

      // Cargar facturación
      try {
        const facturacionData = await vistasApi.getFacturacion(idEmpresa);
        setFacturacion(facturacionData);
      } catch (error) {
        console.warn('No se pudo cargar facturación:', error);
        setFacturacion([]);
      }
      
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalParqueaderos = ocupacion.length;
  const totalCeldasOcupadas = ocupacion.reduce((acc, p) => acc + (p.celdasOcupadas || 0), 0);
  const totalReservasActivas = reservasActivas.length;
  
  // Calcular ingresos totales de la vista
  const ingresosTotal = ingresos.reduce((acc, ing) => acc + (ing.totalIngresos || 0), 0);
  
  // Calcular total de reservas desde historial
  const totalReservas = facturacion.length;

  const columns = [
    {
      title: 'Parqueadero',
      dataIndex: 'nombreParqueadero',
      key: 'nombreParqueadero',
    },
    {
      title: 'Capacidad',
      dataIndex: 'totalCeldas',
      key: 'totalCeldas',
    },
    {
      title: 'Ocupadas',
      dataIndex: 'celdasOcupadas',
      key: 'celdasOcupadas',
    },
    {
      title: 'Disponibles',
      dataIndex: 'celdasLibres',
      key: 'celdasLibres',
    },
    {
      title: 'Ocupación',
      key: 'porcentajeOcupacion',
      render: (_: any, record: OcupacionParqueadero) => {
        const porcentaje = record.totalCeldas > 0 
          ? (record.celdasOcupadas / record.totalCeldas) * 100 
          : 0;
        return `${porcentaje.toFixed(1)}%`;
      },
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Dashboard</h1>
        <div>
          <span style={{ marginRight: 8 }}>Empresa:</span>
          <Select
            value={idEmpresa}
            onChange={setIdEmpresa}
            style={{ width: 250 }}
            placeholder="Seleccionar empresa"
            loading={loadingEmpresas}
          >
            {empresas.map((emp) => (
              <Select.Option key={emp.id} value={emp.id}>
                {emp.nombre}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

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
              title="Ingresos Totales"
              value={ingresosTotal}
              prefix="$"
              suffix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Ingresos"
              value={ingresosTotal}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Reservas"
              value={totalReservas}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Promedio Ocupación"
              value={ocupacion.length > 0 
                ? ocupacion.reduce((sum, item) => {
                    const porcentaje = item.totalCeldas > 0 
                      ? (item.celdasOcupadas / item.totalCeldas * 100) 
                      : 0;
                    return sum + porcentaje;
                  }, 0) / ocupacion.length
                : 0}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Ocupación de Parqueaderos">
        <Table
          columns={columns}
          dataSource={ocupacion}
          rowKey={(record) => record.idParqueadero ? `parqueadero-${record.idParqueadero}` : `parqueadero-${Math.random()}`}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
