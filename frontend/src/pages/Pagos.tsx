import { useState } from 'react';
import { Card, Form, Input, Button, Select, message, Descriptions } from 'antd';
import { DollarOutlined, SearchOutlined } from '@ant-design/icons';
import { reservasApi } from '../api/reservas';
import { vistasApi } from '../api/vistas';
import type { Reserva } from '../types';

const { Option } = Select;

const Pagos = () => {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const handleSearchReserva = async (values: { idReserva: number }) => {
    setSearchLoading(true);
    try {
      const data = await reservasApi.getById(values.idReserva);
      setReserva(data);
      form.setFieldValue('idReserva', data.id);
      message.success('Reserva encontrada');
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      setReserva(null);
      console.error('No se encontró la reserva:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await vistasApi.procesarPago(values.idReserva, values.idMetodoPago);
      // El mensaje de éxito lo muestra el interceptor de axios
      form.resetFields();
      searchForm.resetFields();
      setReserva(null);
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al procesar el pago:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularDuracion = () => {
    if (!reserva?.fechaEntrada || !reserva?.fechaSalida) return '-';
    const entrada = new Date(reserva.fechaEntrada);
    const salida = new Date(reserva.fechaSalida);
    const diffMs = salida.getTime() - entrada.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div>
      <h1>Procesar Pago</h1>

      <Card title="Buscar Reserva" style={{ maxWidth: 600, marginBottom: 24 }}>
        <Form form={searchForm} onFinish={handleSearchReserva} layout="inline">
          <Form.Item
            name="idReserva"
            rules={[{ required: true, message: 'Ingrese ID de reserva' }]}
          >
            <Input
              type="number"
              placeholder="ID de la reserva"
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={searchLoading}
            >
              Buscar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {reserva && (
        <Card title="Información de la Reserva" style={{ maxWidth: 600, marginBottom: 24 }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID Reserva">{reserva.id}</Descriptions.Item>
            <Descriptions.Item label="Placa">
              {reserva.vehiculo?.placa || reserva.idVehiculo}
            </Descriptions.Item>
            <Descriptions.Item label="Celda">{reserva.idCelda}</Descriptions.Item>
            <Descriptions.Item label="Fecha Entrada">
              {new Date(reserva.fechaEntrada).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha Salida">
              {reserva.fechaSalida ? new Date(reserva.fechaSalida).toLocaleString() : 'Activa'}
            </Descriptions.Item>
            <Descriptions.Item label="Duración">{calcularDuracion()}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              <span style={{ 
                color: reserva.estado === 'ABIERTA' ? 'green' : reserva.estado === 'ACTIVA' ? 'orange' : 'gray',
                fontWeight: 'bold'
              }}>
                {reserva.estado}
              </span>
              {reserva.estado !== 'ABIERTA' && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>
                  ⚠️ Solo se pueden procesar pagos de reservas en estado ABIERTA
                </div>
              )}
            </Descriptions.Item>
            {reserva.monto && (
              <Descriptions.Item label="Monto">${reserva.monto.toFixed(2)}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      <Card title="Procesar Pago" style={{ maxWidth: 600 }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="idReserva"
            label="ID Reserva"
            rules={[{ required: true, message: 'Por favor busque una reserva primero' }]}
          >
            <Input type="number" disabled placeholder="Busque una reserva primero" />
          </Form.Item>

          <Form.Item
            name="idMetodoPago"
            label="Método de Pago"
            rules={[{ required: true, message: 'Por favor seleccione un método de pago' }]}
          >
            <Select placeholder="Seleccione el método de pago">
              <Option value={1}>Efectivo</Option>
              <Option value={2}>Tarjeta de Crédito</Option>
              <Option value={3}>Tarjeta de Débito</Option>
              <Option value={4}>Transferencia</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<DollarOutlined />}
              loading={loading}
              block
              disabled={!reserva || reserva.estado !== 'ABIERTA'}
            >
              Procesar Pago
            </Button>
          </Form.Item>
          {reserva && reserva.estado !== 'ABIERTA' && (
            <div style={{ 
              color: 'red', 
              textAlign: 'center', 
              marginTop: 8,
              padding: '8px',
              backgroundColor: '#fff2e8',
              borderRadius: '4px'
            }}>
              No se puede procesar el pago. La reserva debe estar en estado ABIERTA.
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Pagos;
