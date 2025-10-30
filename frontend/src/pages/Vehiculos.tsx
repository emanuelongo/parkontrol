import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Descriptions, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { Vehiculo } from '../types';
import { vehiculosApi } from '../api/vehiculos';
import { useParqueaderos } from '../hooks/useParqueaderos';
import { useEmpresas } from '../hooks/useEmpresas';

const Vehiculos = () => {
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState<number | undefined>();
  const [searchForm] = Form.useForm();
  const [createForm] = Form.useForm();
  
  const { empresas, loading: loadingEmpresas } = useEmpresas();
  const { parqueaderos } = useParqueaderos(idEmpresa || 0);

  // Set first empresa as default when loaded
  useEffect(() => {
    if (empresas.length > 0 && idEmpresa === undefined) {
      setIdEmpresa(empresas[0].id);
    }
  }, [empresas, idEmpresa]);

  const handleSearch = async (values: { placa: string }) => {
    setLoading(true);
    try {
      const data = await vehiculosApi.getByPlaca(values.placa);
      setVehiculo(data);
      message.success('Vehículo encontrado');
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      setVehiculo(null);
      console.error('No se encontró el vehículo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    setLoading(true);
    try {
      await vehiculosApi.create(values);
      // El mensaje de éxito lo muestra el interceptor de axios
      createForm.resetFields();
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al registrar vehículo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Vehículos</h1>

      <Card title="Buscar Vehículo" style={{ marginBottom: 24 }}>
        <Form form={searchForm} onFinish={handleSearch} layout="inline">
          <Form.Item
            name="idParqueadero"
            rules={[{ required: true, message: 'Seleccione el parqueadero' }]}
          >
            <Select placeholder="Seleccionar parqueadero" style={{ width: 250 }}>
              {parqueaderos.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="placa"
            rules={[{ required: true, message: 'Ingrese la placa' }]}
          >
            <Input placeholder="Placa del vehículo" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
              Buscar
            </Button>
          </Form.Item>
        </Form>

        {vehiculo && (
          <Descriptions bordered style={{ marginTop: 24 }}>
            <Descriptions.Item label="ID">{vehiculo.id}</Descriptions.Item>
            <Descriptions.Item label="Placa">{vehiculo.placa}</Descriptions.Item>
            <Descriptions.Item label="Tipo Vehículo">
              {vehiculo.tipoVehiculo?.nombre || vehiculo.idTipoVehiculo}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="Registrar Nuevo Vehículo">
        <Form form={createForm} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="placa"
            label="Placa"
            rules={[
              { required: true, message: 'Por favor ingrese la placa' },
              { min: 3, max: 10, message: 'La placa debe tener entre 3 y 10 caracteres' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="idTipoVehiculo"
            label="ID Tipo de Vehículo"
            initialValue={1}
            rules={[{ required: true, message: 'Por favor ingrese el tipo de vehículo' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
              Registrar Vehículo
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Vehiculos;
