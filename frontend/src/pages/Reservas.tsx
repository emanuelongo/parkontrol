import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, Select } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import type { Reserva } from '../types';
import { reservasApi } from '../api/reservas';
import { useEmpresas } from '../hooks/useEmpresas';
import { useParqueaderos } from '../hooks/useParqueaderos';

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState<number | undefined>();
  const [idParqueadero, setIdParqueadero] = useState<number | undefined>();
  const [form] = Form.useForm();
  
  const { empresas } = useEmpresas();
  const { parqueaderos } = useParqueaderos(idEmpresa || 0);

  // Set first empresa as default when loaded
  useEffect(() => {
    if (empresas.length > 0 && idEmpresa === undefined) {
      setIdEmpresa(empresas[0].id);
    }
  }, [empresas, idEmpresa]);

  // Set first parqueadero as default when loaded
  useEffect(() => {
    if (parqueaderos.length > 0 && idParqueadero === undefined) {
      setIdParqueadero(parqueaderos[0].id);
    }
  }, [parqueaderos, idParqueadero]);

  const fetchReservas = async (parqueaderoId?: number) => {
    if (!parqueaderoId) return;
    
    setLoading(true);
    try {
      const data = await reservasApi.getByParqueadero(parqueaderoId);
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idParqueadero) {
      fetchReservas(idParqueadero);
    }
  }, [idParqueadero]);

  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await reservasApi.create(values);
      // El mensaje de éxito lo muestra el interceptor de axios
      setModalVisible(false);
      if (idParqueadero) {
        fetchReservas(idParqueadero);
      }
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al crear reserva:', error);
    }
  };

  const handleFinalizar = async (idReserva: number) => {
    try {
      await reservasApi.finalizar(idReserva);
      // El mensaje de éxito lo muestra el interceptor de axios
      if (idParqueadero) {
        fetchReservas(idParqueadero);
      }
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al finalizar reserva:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Celda',
      dataIndex: 'idCelda',
      key: 'idCelda',
    },
    {
      title: 'Vehículo',
      dataIndex: 'idVehiculo',
      key: 'idVehiculo',
      render: (idVehiculo: number, record: Reserva) => 
        record.vehiculo?.placa || idVehiculo,
    },
    {
      title: 'Fecha Entrada',
      dataIndex: 'fechaEntrada',
      key: 'fechaEntrada',
      render: (fecha: string) => new Date(fecha).toLocaleString(),
    },
    {
      title: 'Fecha Salida',
      dataIndex: 'fechaSalida',
      key: 'fechaSalida',
      render: (fecha: string) => fecha ? new Date(fecha).toLocaleString() : 'Activa',
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto: number) => monto ? `$${monto.toFixed(2)}` : '-',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: string) => (
        <Tag color={estado === 'ACTIVA' ? 'blue' : estado === 'FINALIZADA' ? 'green' : 'red'}>
          {estado}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Reserva) => (
        <Space>
          {record.estado === 'ACTIVA' && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleFinalizar(record.id)}
            >
              Finalizar
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1>Reservas</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Select
              value={idEmpresa}
              onChange={(value) => {
                setIdEmpresa(value);
                setIdParqueadero(undefined);
              }}
              style={{ width: 200 }}
              placeholder="Seleccionar empresa"
            >
              {empresas.map((emp) => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </Select.Option>
              ))}
            </Select>
            <Select
              value={idParqueadero}
              onChange={setIdParqueadero}
              style={{ width: 250 }}
              placeholder="Seleccionar parqueadero"
            >
              {parqueaderos.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.nombre}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Nueva Reserva
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reservas}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Nueva Reserva"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="idVehiculo"
            label="ID Vehículo"
            rules={[{ required: true, message: 'Por favor ingrese el ID del vehículo' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="idCelda"
            label="ID Celda"
            rules={[{ required: true, message: 'Por favor ingrese el ID de la celda' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="estado"
            label="Estado"
            initialValue="ACTIVA"
            rules={[{ required: true, message: 'Por favor ingrese el estado' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reservas;
