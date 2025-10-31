import { useState, useEffect } from 'react';
import { Table, Tabs, Card, Statistic, Row, Col, Select } from 'antd';
import { CarOutlined, DollarOutlined, HistoryOutlined } from '@ant-design/icons';
import { vistasApi } from '../api/vistas';
import { useEmpresas } from '../hooks/useEmpresas';

const { TabPane } = Tabs;

const Vistas = () => {
  const [ocupacion, setOcupacion] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [facturacion, setFacturacion] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState<number | undefined>();
  
  const { empresas, loading: loadingEmpresas } = useEmpresas();

  // Set first empresa as default when loaded
  useEffect(() => {
    if (empresas.length > 0 && idEmpresa === undefined) {
      setIdEmpresa(empresas[0].id);
    }
  }, [empresas, idEmpresa]);

  const fetchOcupacion = async (empresaId: number) => {
    setLoading(true);
    try {
      const data = await vistasApi.getOcupacion(empresaId);
      setOcupacion(data);
    } catch (error) {
      console.error('[VISTAS] Error al cargar ocupacion:', error);
      setOcupacion([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorial = async (empresaId?: number) => {
    setLoading(true);
    try {
      const data = await vistasApi.getHistorialReservas(empresaId);
      setHistorial(data);
    } catch (error) {
      console.error('[VISTAS] Error al cargar historial:', error);
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngresos = async (empresaId?: number) => {
    setLoading(true);
    try {
      const data = await vistasApi.getIngresos(empresaId);
      setIngresos(data);
    } catch (error) {
      console.error('[VISTAS] Error al cargar ingresos:', error);
      setIngresos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacturacion = async (empresaId?: number) => {
    setLoading(true);
    try {
      const data = await vistasApi.getFacturacion(empresaId);
      setFacturacion(data);
    } catch (error) {
      console.error('[VISTAS] Error al cargar facturación:', error);
      setFacturacion([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idEmpresa !== undefined) {
      fetchOcupacion(idEmpresa);
      fetchHistorial(idEmpresa);
      fetchIngresos(idEmpresa);
      fetchFacturacion(idEmpresa);
    }
  }, [idEmpresa]);

  const columnasOcupacion = [
    {
      title: 'Parqueadero',
      dataIndex: 'nombreParqueadero',
      key: 'nombreParqueadero',
    },
    {
      title: 'Empresa',
      dataIndex: 'nombreEmpresa',
      key: 'nombreEmpresa',
      width: 150,
    },
    {
      title: 'Total Celdas',
      dataIndex: 'totalCeldas',
      key: 'totalCeldas',
      width: 110,
    },
    {
      title: 'Celdas Ocupadas',
      dataIndex: 'celdasOcupadas',
      key: 'celdasOcupadas',
      width: 140,
    },
    {
      title: 'Celdas Libres',
      dataIndex: 'celdasLibres',
      key: 'celdasLibres',
      width: 120,
    },
    {
      title: 'Porcentaje Ocupacion',
      key: 'porcentajeOcupacion',
      width: 170,
      render: (_: any, record: any) => {
        const porcentaje = record.totalCeldas > 0 
          ? (record.celdasOcupadas / record.totalCeldas * 100) 
          : 0;
        return `${porcentaje.toFixed(1)}%`;
      },
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
      dataIndex: 'parqueadero',
      key: 'parqueadero',
    },
    {
      title: 'Tipo Vehiculo',
      dataIndex: 'tipoVehiculo',
      key: 'tipoVehiculo',
      width: 130,
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
      title: 'Empresa',
      dataIndex: 'empresa',
      key: 'empresa',
      width: 150,
    },
    {
      title: 'Parqueadero',
      dataIndex: 'parqueadero',
      key: 'parqueadero',
    },
    {
      title: 'Periodo',
      dataIndex: 'periodo',
      key: 'periodo',
      width: 120,
    },
    {
      title: 'Total Ingresos',
      dataIndex: 'totalIngresos',
      key: 'totalIngresos',
      width: 150,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
  ];

  const columnasFacturacion = [
    {
      title: 'CUFE',
      dataIndex: 'cufe',
      key: 'cufe',
      width: 150,
    },
    {
      title: 'Cliente',
      dataIndex: 'nombreCliente',
      key: 'nombreCliente',
    },
    {
      title: 'Documento',
      dataIndex: 'numeroDocumento',
      key: 'numeroDocumento',
      width: 130,
    },
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
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      width: 120,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Fecha Pago',
      dataIndex: 'fechaPago',
      key: 'fechaPago',
      width: 150,
      render: (fecha: string) => new Date(fecha).toLocaleString('es-ES'),
    },
    {
      title: 'Enviada',
      dataIndex: 'enviada',
      key: 'enviada',
      width: 100,
      render: (enviada: number) => (
        <span style={{ color: enviada === 1 ? 'green' : 'red' }}>
          {enviada === 1 ? 'Sí' : 'No'}
        </span>
      ),
    },
  ];

  const totalIngresos = ingresos.reduce((sum, item) => sum + (item.totalIngresos || 0), 0);
  const totalReservas = historial.length;
  const totalFacturacion = facturacion.reduce((sum, item) => sum + (item.monto || 0), 0);
  const promedioOcupacion = ocupacion.length > 0
    ? ocupacion.reduce((sum, item) => {
        const porcentaje = item.totalCeldas > 0 
          ? (item.celdasOcupadas / item.totalCeldas * 100) 
          : 0;
        return sum + porcentaje;
      }, 0) / ocupacion.length
    : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Vistas Oracle - Analisis de Datos</h1>
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

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
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
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Facturación"
              value={totalFacturacion}
              prefix={<DollarOutlined />}
              suffix="COP"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Reservas"
              value={totalReservas}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
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
            rowKey={(record) => record.idParqueadero || `ocupacion-${Math.random()}`}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Historial de Reservas" key="2">
          <Table
            columns={columnasHistorial}
            dataSource={historial}
            rowKey={(record) => record.idReserva || `reserva-${Math.random()}`}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Ingresos Mensuales" key="3">
          <Table
            columns={columnasIngresos}
            dataSource={ingresos}
            rowKey={(record, index) => `${record.parqueadero}-${record.periodo}-${index}`}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Facturación Completa" key="4">
          <Table
            columns={columnasFacturacion}
            dataSource={facturacion}
            rowKey={(record) => record.cufe || `factura-${Math.random()}`}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Vistas;
