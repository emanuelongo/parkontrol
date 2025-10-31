import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Celda } from '../types';
import { celdasApi } from '../api/celdas';

const { Option } = Select;

const Celdas = () => {
  const [celdas, setCeldas] = useState<Celda[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCeldas = async (idParqueadero: number) => {
    setLoading(true);
    try {
      const data = await celdasApi.getByParqueadero(idParqueadero);
      setCeldas(data);
    } catch (error) {
      message.error('Error al cargar celdas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCeldas(1);
  }, []);

  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await celdasApi.create(values);
      // El mensaje de éxito lo muestra el interceptor de axios
      setModalVisible(false);
      fetchCeldas(1);
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al crear celda:', error);
    }
  };

  const handleUpdateEstado = async (idCelda: number, estado: string) => {
    try {
      await celdasApi.updateEstado(idCelda, estado);
      // El mensaje de éxito lo muestra el interceptor de axios
      fetchCeldas(1);
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al actualizar estado:', error);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'green';
      case 'OCUPADA':
        return 'red';
      case 'MANTENIMIENTO':
        return 'orange';
      default:
        return 'default';
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
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: string) => (
        <Tag color={getEstadoColor(estado)}>{estado}</Tag>
      ),
    },
    {
      title: 'Tipo Celda',
      dataIndex: 'idTipoCelda',
      key: 'idTipoCelda',
    },
    {
      title: 'Sensor',
      dataIndex: 'idSensor',
      key: 'idSensor',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Celda) => (
        <Space>
          <Select
            defaultValue={record.estado}
            style={{ width: 180 }}
            onChange={(value) => handleUpdateEstado(record.id, value)}
          >
            <Option value="DISPONIBLE">Disponible</Option>
            <Option value="OCUPADA">Ocupada</Option>
            <Option value="MANTENIMIENTO">Mantenimiento</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Celdas</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Nueva Celda
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={celdas}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title="Nueva Celda"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="idParqueadero"
            label="ID Parqueadero"
            initialValue={1}
            rules={[{ required: true, message: 'Por favor ingrese el ID del parqueadero' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="idTipoCelda"
            label="ID Tipo Celda"
            initialValue={1}
            rules={[{ required: true, message: 'Por favor ingrese el tipo de celda' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="idSensor"
            label="ID Sensor"
            initialValue={1}
            rules={[{ required: true, message: 'Por favor ingrese el ID del sensor' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="estado"
            label="Estado"
            initialValue="DISPONIBLE"
            rules={[{ required: true, message: 'Por favor seleccione el estado' }]}
          >
            <Select>
              <Option value="DISPONIBLE">Disponible</Option>
              <Option value="OCUPADA">Ocupada</Option>
              <Option value="MANTENIMIENTO">Mantenimiento</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Celdas;
