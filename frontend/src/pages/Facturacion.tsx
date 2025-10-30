import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tabs } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { facturacionApi } from '../api/facturacion';

const { TabPane } = Tabs;

const Facturacion = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalFacturaVisible, setModalFacturaVisible] = useState(false);
  const [formCliente] = Form.useForm();
  const [formFactura] = Form.useForm();

  const fetchClientes = async () => {
    setLoading(true);
    try {
      // Implementar cuando exista endpoint
      console.log('[FACTURACION] Cargando clientes...');
    } catch (error) {
      console.error('[FACTURACION] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleCreateCliente = async () => {
    try {
      const values = await formCliente.validateFields();
      await facturacionApi.createCliente(values);
      setModalClienteVisible(false);
      fetchClientes();
      formCliente.resetFields();
    } catch (error) {
      console.error('[FACTURACION] Error al crear cliente:', error);
    }
  };

  const handleCreateFactura = async () => {
    try {
      const values = await formFactura.validateFields();
      const formattedValues = {
        ...values,
        fechaEmision: values.fechaEmision?.toISOString(),
      };
      await facturacionApi.createFactura(formattedValues);
      setModalFacturaVisible(false);
      formFactura.resetFields();
    } catch (error) {
      console.error('[FACTURACION] Error al crear factura:', error);
    }
  };

  const columnasClientes = [
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
      title: 'Documento',
      dataIndex: 'documento',
      key: 'documento',
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Telefono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
  ];

  const columnasFacturas = [
    {
      title: 'Numero',
      dataIndex: 'numeroFactura',
      key: 'numeroFactura',
    },
    {
      title: 'Cliente',
      dataIndex: 'idCliente',
      key: 'idCliente',
      width: 100,
    },
    {
      title: 'Pago',
      dataIndex: 'idPago',
      key: 'idPago',
      width: 100,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'IVA',
      dataIndex: 'iva',
      key: 'iva',
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Estado',
      dataIndex: 'enviada',
      key: 'enviada',
      render: (enviada: boolean) => (
        <span style={{ color: enviada ? 'green' : 'orange' }}>
          {enviada ? 'Enviada' : 'Pendiente'}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>Gestion de Facturacion</h2>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Clientes" key="1">
          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalClienteVisible(true)}
            >
              Nuevo Cliente
            </Button>
          </div>

          <Table
            columns={columnasClientes}
            dataSource={clientes}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Facturas" key="2">
          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => setModalFacturaVisible(true)}
            >
              Nueva Factura
            </Button>
          </div>

          <Table
            columns={columnasFacturas}
            dataSource={facturas}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      {/* Modal Cliente */}
      <Modal
        title="Crear Cliente"
        open={modalClienteVisible}
        onOk={handleCreateCliente}
        onCancel={() => setModalClienteVisible(false)}
        width={600}
      >
        <Form form={formCliente} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="documento"
            label="Documento"
            rules={[{ required: true, message: 'El documento es requerido' }]}
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

          <Form.Item name="telefono" label="Telefono">
            <Input />
          </Form.Item>

          <Form.Item name="direccion" label="Direccion">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Factura */}
      <Modal
        title="Crear Factura"
        open={modalFacturaVisible}
        onOk={handleCreateFactura}
        onCancel={() => setModalFacturaVisible(false)}
        width={600}
      >
        <Form form={formFactura} layout="vertical">
          <Form.Item
            name="idPago"
            label="ID Pago"
            rules={[{ required: true, message: 'El ID de pago es requerido' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="idCliente"
            label="ID Cliente"
            rules={[{ required: true, message: 'El ID de cliente es requerido' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="numeroFactura"
            label="Numero de Factura"
            rules={[{ required: true, message: 'El numero de factura es requerido' }]}
          >
            <Input placeholder="FACT-2024-001" />
          </Form.Item>

          <Form.Item
            name="fechaEmision"
            label="Fecha de Emision"
            rules={[{ required: true, message: 'La fecha es requerida' }]}
          >
            <DatePicker style={{ width: '100%' }} showTime />
          </Form.Item>

          <Space style={{ width: '100%' }} direction="vertical">
            <Form.Item
              name="subtotal"
              label="Subtotal"
              rules={[{ required: true, message: 'El subtotal es requerido' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="iva"
              label="IVA"
              rules={[{ required: true, message: 'El IVA es requerido' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="total"
              label="Total"
              rules={[{ required: true, message: 'El total es requerido' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Facturacion;
