import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Popconfirm, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Usuario } from '../types';
import { usuariosApi } from '../api/usuarios';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState<number>(1);
  const [form] = Form.useForm();

  const fetchUsuarios = async (empresaId: number) => {
    setLoading(true);
    try {
      const data = await usuariosApi.getByEmpresa(empresaId);
      setUsuarios(data);
    } catch (error) {
      console.error('[USUARIOS] Error al cargar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(idEmpresa);
  }, [idEmpresa]);

  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await usuariosApi.create(values);
      setModalVisible(false);
      fetchUsuarios(1);
      form.resetFields();
    } catch (error) {
      console.error('[USUARIOS] Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await usuariosApi.delete(id);
      fetchUsuarios(1);
    } catch (error) {
      console.error('[USUARIOS] Error al eliminar:', error);
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
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Empresa',
      dataIndex: 'idEmpresa',
      key: 'idEmpresa',
      width: 100,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_: any, record: Usuario) => (
        <Space>
          <Popconfirm
            title="Eliminar usuario"
            description="¿Estas seguro de eliminar este usuario?"
            onConfirm={() => handleDelete(record.id)}
            okText="Si"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2>Gestion de Usuarios</h2>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Nuevo Usuario
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={usuarios}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Crear Usuario"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="correo"
            label="Correo"
            rules={[
              { required: true, message: 'El correo es requerido' },
              { type: 'email', message: 'Correo invalido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contrasena"
            label="Contrasena"
            rules={[{ required: true, message: 'La contrasena es requerida' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="idEmpresa"
            label="ID Empresa"
            rules={[{ required: true, message: 'El ID de empresa es requerido' }]}
            initialValue={1}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Usuarios;
