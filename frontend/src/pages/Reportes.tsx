import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Reporte } from '../types';
import { reportesApi } from '../api/reportes';
import { useEmpresas } from '../hooks/useEmpresas';
import { useParqueaderos } from '../hooks/useParqueaderos';
import dayjs from 'dayjs';

const Reportes = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(false);
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

  const fetchReportes = async (parqueaderoId?: number) => {
    if (!parqueaderoId) return;
    
    setLoading(true);
    try {
      const data = await reportesApi.getByParqueadero(parqueaderoId);
      setReportes(data);
    } catch (error) {
      console.error('[REPORTES] Error al cargar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idParqueadero) {
      fetchReportes(idParqueadero);
    }
  }, [idParqueadero]);

  const handleCreate = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        idParqueadero: values.idParqueadero,
        idPeriodo: values.idPeriodo,
      };
      await reportesApi.create(formattedValues);
      setModalVisible(false);
      if (idParqueadero) {
        fetchReportes(idParqueadero);
      }
      form.resetFields();
    } catch (error) {
      console.error('[REPORTES] Error:', error);
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
      title: 'Periodo',
      dataIndex: 'idPeriodo',
      key: 'idPeriodo',
      width: 120,
    },
    {
      title: 'URL Archivo',
      dataIndex: 'urlPdf',
      key: 'urlPdf',
      render: (url: string) => url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Ver PDF
        </a>
      ) : (
        <span style={{ color: '#999' }}>Pendiente</span>
      ),
    },
    {
      title: 'Fecha Generacion',
      dataIndex: 'fechaGeneracion',
      key: 'fechaGeneracion',
      width: 180,
      render: (fecha: string) => fecha ? dayjs(fecha).format('DD/MM/YYYY HH:mm') : '-',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2>Gestion de Reportes</h2>
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
          Generar Reporte
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reportes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Generar Reporte"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="idParqueadero"
            label="Parqueadero"
            rules={[{ required: true, message: 'El parqueadero es requerido' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar parqueadero"
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={parqueaderos.map((p) => ({
                label: p.nombre,
                value: p.id,
              }))}
              virtual
            />
          </Form.Item>

          <Form.Item
            name="idPeriodo"
            label="ID Periodo"
            rules={[{ required: true, message: 'El periodo es requerido' }]}
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>Enero 2024</Select.Option>
              <Select.Option value={2}>Febrero 2024</Select.Option>
              <Select.Option value={3}>Marzo 2024</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reportes;
