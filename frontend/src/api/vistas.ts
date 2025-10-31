import api from './axios';

export interface OcupacionParqueadero {
  idParqueadero: number;
  nombreParqueadero: string;
  nombreEmpresa: string;
  totalCeldas: number;
  celdasOcupadas: number;
  celdasLibres: number;
}

export interface HistorialReserva {
  idReserva: number;
  placa: string;
  numeroCelda: string;
  nombreParqueadero: string;
  fechaEntrada: string;
  fechaSalida: string | null;
  duracionMinutos: number | null;
  estado: string;
  montoTotal: number | null;
}

export interface FacturacionCompleta {
  idFactura: number;
  cufe: string;
  nombreCliente: string;
  numeroDocumento: string;
  placa: string;
  nombreParqueadero: string;
  monto: number;
  fechaPago: string;
  enviada: number;
}

export interface IngresoMensual {
  idParqueadero: number;
  nombreParqueadero: string;
  mes: string;
  anio: number;
  ingresoTotal: number;
  cantidadPagos: number;
}

export const vistasApi = {
  getOcupacion: async (idEmpresa?: number): Promise<OcupacionParqueadero[]> => {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    const { data } = await api.get(`/views/ocupacion${params}`);
    return data;
  },

  getOcupacionByParqueadero: async (idParqueadero: number): Promise<OcupacionParqueadero> => {
    const { data } = await api.get(`/views/ocupacion/${idParqueadero}`);
    return data;
  },

  getHistorialReservas: async (idEmpresa?: number): Promise<HistorialReserva[]> => {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    const { data } = await api.get(`/views/historial-reservas${params}`);
    return data;
  },

  getHistorialByPlaca: async (
    idParqueadero: number,
    placa: string
  ): Promise<HistorialReserva[]> => {
    const { data } = await api.get(
      `/views/historial-reservas/parqueadero/${idParqueadero}/placa/${placa}`
    );
    return data;
  },

  getFacturacion: async (idEmpresa?: number): Promise<FacturacionCompleta[]> => {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    const { data } = await api.get(`/views/facturacion${params}`);
    return data;
  },

  getFacturacionByDocumento: async (numeroDocumento: string, idEmpresa?: number): Promise<FacturacionCompleta[]> => {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    const { data } = await api.get(`/views/facturacion/documento/${numeroDocumento}${params}`);
    return data;
  },

  getIngresos: async (idEmpresa?: number): Promise<IngresoMensual[]> => {
    const params = idEmpresa ? `?idEmpresa=${idEmpresa}` : '';
    const { data } = await api.get(`/views/ingresos${params}`);
    return data;
  },

  getIngresosByParqueadero: async (idParqueadero: number): Promise<IngresoMensual[]> => {
    const { data } = await api.get(`/views/ingresos/parqueadero/${idParqueadero}`);
    return data;
  },

  procesarPago: async (idReserva: number, idMetodoPago: number): Promise<any> => {
    const { data } = await api.post('/views/procesar-pago', {
      idReserva,
      idMetodoPago,
    });
    return data;
  },

  buscarVehiculo: async (placa: string): Promise<any> => {
    const { data } = await api.get(`/views/buscar-vehiculo/${placa}`);
    return data;
  },
};
