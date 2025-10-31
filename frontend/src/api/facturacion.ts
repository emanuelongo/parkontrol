import api from './axios';
import type { ClienteFactura, FacturaElectronica } from '../types';

export const facturacionApi = {
  createCliente: async (data: {
    tipoDocumento: string;
    numeroDocumento: string;
    correo: string;
  }): Promise<ClienteFactura> => {
    const response = await api.post('/invoicing/clientes', data);
    return response.data;
  },

  createFactura: async (data: {
    idPago: number;
    idClienteFactura: number;
    cufe: string;
    urlPdf?: string;
  }): Promise<FacturaElectronica> => {
    const response = await api.post('/invoicing/facturas', data);
    return response.data;
  },

  marcarComoEnviada: async (idFactura: number): Promise<FacturaElectronica> => {
    const response = await api.patch(`/invoicing/facturas/${idFactura}/enviar`);
    return response.data;
  },

  getByPago: async (idPago: number): Promise<FacturaElectronica> => {
    const { data } = await api.get(`/invoicing/facturas/pago/${idPago}`);
    return data;
  },
};
