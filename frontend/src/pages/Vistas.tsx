import { useState, useEffect } from 'react';
import { Table, Tabs, Card, Statistic, Row, Col, Select } from 'antd';
import { CarOutlined, DollarOutlined, HistoryOutlined } from '@ant-design/icons';
import { vistasApi } from '../api/vistas';

const { TabPane } = Tabs;

const Vistas = () => {
  const [ocupacion, setOcupacion] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState<number>(1);

  const fetchOcupacion = async (empresaId: number) => {
    setLoading(true);
    try {
      const data = await vistasApi.getOcupacion(empresaId);
      setOcupacion(data);
    } catch (error) {
      console.error('[VISTAS] Error al cargar ocupacion:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const data = await vistasApi.getHistorialReservas();
      setHistorial(data);
    } catch (error) {
      console.error('[VISTAS] Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngresos = async () => {
    setLoading(true);
    try {
      const data = await vistasApi.getIngresos();
      setIngresos(data);
    } catch (error) {
      console.error('[VISTAS] Error al cargar ingresos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOcupacion(idEmpresa);
    fetchHistorial();
    fetchIngresos();
  }, [idEmpresa]);

  const columnasOcupacion = [
    {
      title: 'Parqueadero',
      dataIndex: 'nombreParqueadero',
      key: 'nombreParqueadero',
    },
    {
      title: 'Capacidad Total',
      dataIndex: 'capacidadTotal',
      key: 'capacidadTotal',
      width: 130,
    },
    {
      title: 'Celdas Ocupadas',
      dataIndex: 'celdasOcupadas',
      key: 'celdasOcupadas',
      width: 140,
    },
    {
      title: 'Celdas Disponibles',
      dataIndex: 'celdasDisponibles',
      key: 'celdasDisponibles',
      width: 160,
    },
    {
      title: 'Porcentaje Ocupacion',
      dataIndex: 'porcentajeOcupacion',
      key: 'porcentajeOcupacion',
      width: 170,
      render: (value: number) => `${value?.toFixed(2) || 0}%`,
    },
  ];

  const columnasHistorial = [
    {
      title: 'Placa',
      dataIndex: 'placa',
      key: 'placa',
      width: 100,
    },
    {
      title: 'Parqueadero',
      dataIndex: 'nombreParqueadero',
      key: 'nombreParqueadero',
    },
    {
      title: 'Celda',
      dataIndex: 'numeroCelda',
      key: 'numeroCelda',
      width: 100,
    },
    {
      title: 'Entrada',
      dataIndex: 'fechaEntrada',
      key: 'fechaEntrada',
      width: 150,
      render: (fecha: string) => new Date(fecha).toLocaleString('es-ES'),
    },
    {
      title: 'Salida',
      dataIndex: 'fechaSalida',
      key: 'fechaSalida',
      width: 150,
      render: (fecha: string) => fecha ? new Date(fecha).toLocaleString('es-ES') : 'Activa',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 100,
      render: (estado: string) => (
        <span style={{ color: estado === 'ABIERTA' ? 'green' : 'gray' }}>
          {estado}
        </span>
      ),
    },
  ];

  const columnasIngresos = [
    {
      title: 'Parqueadero',
      dataIndex: 'nombreParqueadero',
      key: 'nombreParqueadero',
    },
    {
      title: 'Periodo',
      dataIndex: 'periodo',
      key: 'periodo',
      width: 120,
    },
    {
      title: 'Total Reservas',
      dataIndex: 'totalReservas',
      key: 'totalReservas',
      width: 130,
    },
    {
      title: 'Total Ingresos',
      dataIndex: 'totalIngresos',
      key: 'totalIngresos',
      width: 150,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Promedio por Reserva',
      dataIndex: 'promedioIngreso',
      key: 'promedioIngreso',
      width: 180,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
  ];

  const totalIngresos = ingresos.reduce((sum, item) => sum + (item.totalIngresos || 0), 0);
  const totalReservas = historial.length;
  const promedioOcupacion = ocupacion.length > 0
    ? ocupacion.reduce((sum, item) => sum + (item.porcentajeOcupacion || 0), 0) / ocupacion.length
    : 0;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Vistas Oracle - Analisis de Datos</h2>
        <div>
          <span style={{ marginRight: 8 }}>Empresa:</span>
          <Select
            value={idEmpresa}
            onChange={setIdEmpresa}
            style={{ width: 150 }}
          >
            <Select.Option value={1}>Empresa 1</Select.Option>
            <Select.Option value={2}>Empresa 2</Select.Option>
            <Select.Option value={3}>Empresa 3</Select.Option>
          </Select>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Ingresos"
              value={totalIngresos}
              prefix={<DollarOutlined />}
              suffix="COP"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Reservas"
              value={totalReservas}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Promedio Ocupacion"
              value={promedioOcupacion}
              prefix={<CarOutlined />}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Ocupacion de Parqueaderos" key="1">
          <Table
            columns={columnasOcupacion}
            dataSource={ocupacion}
            rowKey="idParqueadero"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Historial de Reservas" key="2">
          <Table
            columns={columnasHistorial}
            dataSource={historial}
            rowKey="idReserva"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Ingresos Mensuales" key="3">
          <Table
            columns={columnasIngresos}
            dataSource={ingresos}
            rowKey={(record) => `${record.idParqueadero}-${record.periodo}`}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Vistas;
