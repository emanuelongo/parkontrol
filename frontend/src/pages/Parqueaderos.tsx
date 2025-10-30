import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Parqueadero } from '../types';
import { parqueaderosApi } from '../api/parqueaderos';

const Parqueaderos = () => {
  const [parqueaderos, setParqueaderos] = useState<Parqueadero[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchParqueaderos = async (idEmpresa: number) => {
    setLoading(true);
    try {
      const data = await parqueaderosApi.getByEmpresa(idEmpresa);
      setParqueaderos(data);
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al cargar parqueaderos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParqueaderos(1);
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Parqueadero) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('[PARQUEADEROS] Valores:', values);
      
      if (editingId) {
        // TODO: Implementar actualización cuando exista el endpoint
        message.info('Funcion de actualizacion pendiente');
      } else {
        await parqueaderosApi.create(values);
        // El interceptor muestra la notificacion automaticamente
      }
      setModalVisible(false);
      fetchParqueaderos(1);
    } catch (error) {
      console.error('[PARQUEADEROS] Error:', error);
      // El interceptor ya maneja los errores
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
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacion',
      key: 'ubicacion',
    },
    {
      title: 'Capacidad',
      dataIndex: 'capacidadTotal',
      key: 'capacidadTotal',
      width: 120,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_: any, record: Parqueadero) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Está seguro de eliminar este parqueadero?"
            onConfirm={() => message.info('Función de eliminación no implementada')}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Parqueaderos</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Nuevo Parqueadero
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={parqueaderos}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Editar Parqueadero' : 'Nuevo Parqueadero'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ubicacion"
            label="Ubicación"
            rules={[{ required: true, message: 'Por favor ingrese la ubicación' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="capacidadTotal"
            label="Capacidad Total"
            rules={[{ required: true, message: 'Por favor ingrese la capacidad' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="idEmpresa"
            label="ID Empresa"
            initialValue={1}
            rules={[{ required: true, message: 'Por favor ingrese el ID de empresa' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Parqueaderos;
