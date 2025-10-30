import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Space } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import type { Reporte } from '../types';
import { reportesApi } from '../api/reportes';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Reportes = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchReportes = async (idParqueadero: number) => {
    setLoading(true);
    try {
      const data = await reportesApi.getByParqueadero(idParqueadero);
      setReportes(data);
    } catch (error) {
      console.error('[REPORTES] Error al cargar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes(1);
  }, []);

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
      fetchReportes(1);
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
        <h2>Gestion de Reportes</h2>
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
            label="ID Parqueadero"
            rules={[{ required: true, message: 'El parqueadero es requerido' }]}
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>Parqueadero 1</Select.Option>
              <Select.Option value={2}>Parqueadero 2</Select.Option>
            </Select>
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
