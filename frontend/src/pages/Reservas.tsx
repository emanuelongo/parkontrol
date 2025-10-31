import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, Select } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import type { Reserva, Celda } from '../types';
import { reservasApi } from '../api/reservas';
import { celdasApi } from '../api/celdas';
import { useEmpresas } from '../hooks/useEmpresas';
import { useParqueaderos } from '../hooks/useParqueaderos';

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [celdas, setCeldas] = useState<Celda[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCeldas, setLoadingCeldas] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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

  const fetchReservas = async (parqueaderoId?: number) => {
    if (!parqueaderoId) return;
    
    setLoading(true);
    try {
      const data = await reservasApi.getByParqueadero(parqueaderoId);
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCeldasDisponibles = async (parqueaderoId?: number) => {
    if (!parqueaderoId) return;
    
    setLoadingCeldas(true);
    try {
      const data = await celdasApi.getByParqueadero(parqueaderoId);
      console.log('🔍 Todas las celdas del parqueadero:', data);
      console.log('🔍 Estados únicos encontrados:', [...new Set(data.map(c => c.estado))]);
      
      // Si no hay celdas, mostrar mensaje
      if (data.length === 0) {
        console.warn('⚠️ No hay celdas en este parqueadero');
        setCeldas([]);
        return;
      }
      
      // Filtrar solo las celdas disponibles (intentar varios posibles estados)
      const disponibles = data.filter((celda) => {
        const estadoUpper = celda.estado?.toUpperCase().trim();
        const esDisponible = 
          estadoUpper === 'DISPONIBLE' || 
          estadoUpper === 'LIBRE' || 
          estadoUpper === 'DESOCUPADA' ||
          estadoUpper === 'VACIA';
        return esDisponible;
      });
      
      console.log(`✅ ${disponibles.length} celdas disponibles de ${data.length} totales`);
      
      // Si no hay disponibles, mostrar todas pero con advertencia
      if (disponibles.length === 0) {
        console.warn('⚠️ No hay celdas disponibles, mostrando todas');
        setCeldas(data); // Mostrar todas para que el usuario vea qué hay
      } else {
        setCeldas(disponibles);
      }
    } catch (error) {
      console.error('❌ Error al cargar celdas:', error);
      setCeldas([]);
    } finally {
      setLoadingCeldas(false);
    }
  };

  useEffect(() => {
    if (idParqueadero) {
      fetchReservas(idParqueadero);
    }
  }, [idParqueadero]);

  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
    // Cargar celdas disponibles del parqueadero seleccionado
    if (idParqueadero) {
      fetchCeldasDisponibles(idParqueadero);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await reservasApi.create(values);
      // El mensaje de éxito lo muestra el interceptor de axios
      setModalVisible(false);
      if (idParqueadero) {
        fetchReservas(idParqueadero);
      }
    } catch (error) {
      // El error ya se muestra por el interceptor de axios
      console.error('Error al crear reserva:', error);
    }
  };

  const handleFinalizar = async (idReserva: number) => {
    try {
      await reservasApi.finalizar(idReserva);
      // El mensaje de éxito lo muestra el interceptor de axios
      if (idParqueadero) {
        fetchReservas(idParqueadero);
      }
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
      render: (idCelda: number, record: Reserva) => 
        record.celda ? `Celda #${idCelda} (${record.celda.estado})` : `Celda #${idCelda}`,
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1>Reservas</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Select
              value={idEmpresa}
              onChange={(value) => {
                setIdEmpresa(value);
                setIdParqueadero(undefined);
              }}
              style={{ width: 200 }}
              placeholder="Seleccionar empresa"
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={empresas.map((e) => ({
                label: e.nombre,
                value: e.id,
              }))}
            />
            <Select
              value={idParqueadero}
              onChange={setIdParqueadero}
              style={{ width: 250 }}
              placeholder="Seleccionar parqueadero"
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={parqueaderos.map((p) => ({
                label: p.nombre,
                value: p.id,
              }))}
              virtual
              dropdownMatchSelectWidth={false}
            />
          </div>
        </div>
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
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="idVehiculo"
            label="ID Vehículo"
            rules={[{ required: true, message: 'Por favor ingrese el ID del vehículo' }]}
          >
            <Input type="number" placeholder="Ej: 123" />
          </Form.Item>

          <Form.Item
            name="idCelda"
            label="Seleccionar Celda"
            rules={[{ required: true, message: 'Por favor seleccione una celda' }]}
            tooltip="Solo se muestran las celdas disponibles del parqueadero seleccionado"
          >
            <Select
              placeholder={loadingCeldas ? 'Cargando celdas...' : 'Seleccionar celda'}
              loading={loadingCeldas}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={celdas.map((c) => {
                const estadoUpper = c.estado?.toUpperCase().trim();
                const esDisponible = 
                  estadoUpper === 'DISPONIBLE' || 
                  estadoUpper === 'LIBRE' || 
                  estadoUpper === 'DESOCUPADA' ||
                  estadoUpper === 'VACIA';
                
                return {
                  label: esDisponible 
                    ? `✅ Celda #${c.id} - Tipo: ${c.idTipoCelda} [${c.estado}]`
                    : `⛔ Celda #${c.id} - Tipo: ${c.idTipoCelda} [${c.estado}]`,
                  value: c.id,
                  disabled: !esDisponible, // Deshabilitar las no disponibles
                };
              })}
              notFoundContent={
                loadingCeldas ? 'Cargando celdas...' : 
                celdas.length === 0 ? 'No hay celdas en este parqueadero. Verifica que has seleccionado un parqueadero válido.' : 
                null
              }
            />
          </Form.Item>

          <Form.Item
            name="estado"
            label="Estado"
            initialValue="ABIERTA"
            rules={[{ required: true, message: 'Por favor ingrese el estado' }]}
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reservas;
