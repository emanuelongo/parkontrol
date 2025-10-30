import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputNumber, Space, Select } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { Tarifa } from '../types';
import { tarifasApi } from '../api/tarifas';

const Tarifas = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchTarifas = async (idParqueadero: number) => {
    setLoading(true);
    try {
      const data = await tarifasApi.getByParqueadero(idParqueadero);
      setTarifas(data);
    } catch (error) {
      console.error('[TARIFAS] Error al cargar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifas(1);
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Tarifa) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await tarifasApi.update(editingId, values);
      } else {
        await tarifasApi.create(values);
      }
      setModalVisible(false);
      fetchTarifas(1);
      form.resetFields();
    } catch (error) {
      console.error('[TARIFAS] Error:', error);
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
      title: 'Parqueadero',
      dataIndex: 'idParqueadero',
      key: 'idParqueadero',
      width: 120,
    },
    {
      title: 'Tipo Vehiculo',
      dataIndex: 'idTipoVehiculo',
      key: 'idTipoVehiculo',
      width: 130,
    },
    {
      title: 'Tarifa Hora',
      dataIndex: 'valorHora',
      key: 'valorHora',
      width: 120,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Tarifa Dia',
      dataIndex: 'valorDia',
      key: 'valorDia',
      width: 120,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Tarifa Mes',
      dataIndex: 'valorMes',
      key: 'valorMes',
      width: 120,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Tarifa) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestion de Tarifas</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Nueva Tarifa
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tarifas}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingId ? 'Editar Tarifa' : 'Crear Tarifa'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="idParqueadero"
            label="ID Parqueadero"
            rules={[{ required: true, message: 'El ID de parqueadero es requerido' }]}
            initialValue={1}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name="idTipoVehiculo"
            label="ID Tipo Vehiculo"
            rules={[{ required: true, message: 'El tipo de vehiculo es requerido' }]}
            initialValue={1}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name="valorHora"
            label="Tarifa por Hora"
            rules={[{ required: true, message: 'La tarifa por hora es requerida' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="valorDia"
            label="Tarifa por Dia"
            rules={[{ required: true, message: 'La tarifa por dia es requerida' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="valorMes"
            label="Tarifa por Mes"
            rules={[{ required: true, message: 'La tarifa por mes es requerida' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tarifas;
