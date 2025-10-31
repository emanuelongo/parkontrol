import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputNumber, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { Tarifa } from '../types';
import { tarifasApi } from '../api/tarifas';
import { useEmpresas } from '../hooks/useEmpresas';
import { useParqueaderos } from '../hooks/useParqueaderos';

const Tarifas = () => {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const fetchTarifas = async (parqueaderoId?: number) => {
    if (!parqueaderoId) return;
    
    setLoading(true);
    try {
      const data = await tarifasApi.getByParqueadero(parqueaderoId);
      setTarifas(data);
    } catch (error) {
      console.error('[TARIFAS] Error al cargar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idParqueadero) {
      fetchTarifas(idParqueadero);
    }
  }, [idParqueadero]);

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
      // El mensaje de éxito lo muestra el interceptor de axios
      setModalVisible(false);
      if (idParqueadero) {
        fetchTarifas(idParqueadero);
      }
      form.resetFields();
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
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
      title: 'Precio Fracción Hora',
      dataIndex: 'precioFraccionHora',
      key: 'precioFraccionHora',
      width: 150,
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Precio Hora Adicional',
      dataIndex: 'precioHoraAdicional',
      key: 'precioHoraAdicional',
      width: 150,
      render: (value: number) => value ? `$${value.toLocaleString()}` : '-',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2>Gestion de Tarifas</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={idEmpresa}
              onChange={(e) => {
                setIdEmpresa(Number(e.target.value));
                setIdParqueadero(undefined);
              }}
              style={{ padding: '4px 11px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
            >
              <option value="">Seleccionar empresa</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
            <select
              value={idParqueadero}
              onChange={(e) => setIdParqueadero(Number(e.target.value))}
              style={{ padding: '4px 11px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
            >
              <option value="">Seleccionar parqueadero</option>
              {parqueaderos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
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
            initialValue={idParqueadero}
          >
            <InputNumber style={{ width: '100%' }} min={1} placeholder="1" />
          </Form.Item>

          <Form.Item
            name="idTipoVehiculo"
            label="ID Tipo Vehiculo"
            rules={[{ required: true, message: 'El tipo de vehiculo es requerido' }]}
            initialValue={1}
          >
            <InputNumber style={{ width: '100%' }} min={1} placeholder="1 = Carro, 2 = Moto, etc." />
          </Form.Item>

          <Form.Item
            name="precioFraccionHora"
            label="Precio Fracción de Hora"
            rules={[
              { required: true, message: 'El precio fracción hora es requerido' },
              { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              placeholder="5000"
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            name="precioHoraAdicional"
            label="Precio Hora Adicional (Opcional)"
            rules={[
              { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              placeholder="3000"
              prefix="$"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tarifas;
