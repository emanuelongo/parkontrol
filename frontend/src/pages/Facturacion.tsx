import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Tabs } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { facturacionApi } from '../api/facturacion';

const { TabPane } = Tabs;

const Facturacion = () => {
  const [clientes] = useState<any[]>([]);
  const [facturas] = useState<any[]>([]);
  const [loading] = useState(false);
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalFacturaVisible, setModalFacturaVisible] = useState(false);
  const [formCliente] = Form.useForm();
  const [formFactura] = Form.useForm();



  const handleCreateCliente = async () => {
    try {
      const values = await formCliente.validateFields();
      await facturacionApi.createCliente(values);
      // El mensaje de éxito lo muestra el interceptor de axios
      setModalClienteVisible(false);
      formCliente.resetFields();
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('[FACTURACION] Error al crear cliente:', error);
    }
  };

  const handleCreateFactura = async () => {
    try {
      const values = await formFactura.validateFields();
      await facturacionApi.createFactura(values);
      // El mensaje de éxito lo muestra el interceptor de axios
      setModalFacturaVisible(false);
      formFactura.resetFields();
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
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
            name="tipoDocumento"
            label="Tipo de Documento"
            rules={[
              { required: true, message: 'El tipo de documento es requerido' },
              { min: 2, max: 10, message: 'Debe tener entre 2 y 10 caracteres' }
            ]}
          >
            <Input placeholder="CC, NIT, CE, etc." />
          </Form.Item>

          <Form.Item
            name="numeroDocumento"
            label="Número de Documento"
            rules={[
              { required: true, message: 'El número de documento es requerido' },
              { min: 5, max: 20, message: 'Debe tener entre 5 y 20 caracteres' }
            ]}
          >
            <Input placeholder="1234567890" />
          </Form.Item>

          <Form.Item
            name="correo"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'El correo es requerido' },
              { type: 'email', message: 'Correo inválido' }
            ]}
          >
            <Input placeholder="cliente@ejemplo.com" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Factura */}
      <Modal
        title="Crear Factura Electrónica"
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
            <Input type="number" placeholder="1" />
          </Form.Item>

          <Form.Item
            name="idClienteFactura"
            label="ID Cliente Facturación"
            rules={[{ required: true, message: 'El ID de cliente es requerido' }]}
          >
            <Input type="number" placeholder="1" />
          </Form.Item>

          <Form.Item
            name="cufe"
            label="CUFE (Código Único de Facturación Electrónica)"
            rules={[{ required: true, message: 'El CUFE es requerido' }]}
          >
            <Input placeholder="ABC123XYZ456..." />
          </Form.Item>

          <Form.Item
            name="urlPdf"
            label="URL del PDF (Opcional)"
          >
            <Input placeholder="https://ejemplo.com/factura.pdf" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Facturacion;
