import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import type { Reserva } from '../types';
import { reservasApi } from '../api/reservas';

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const data = await reservasApi.getActivas();
      setReservas(data);
    } catch (error) {
      message.error('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

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
      fetchReservas();
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al crear reserva:', error);
    }
  };

  const handleFinalizar = async (idReserva: number) => {
    try {
      await reservasApi.finalizar(idReserva);
      // El mensaje de éxito lo muestra el interceptor de axios
      fetchReservas();
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Reservas</h1>
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
