export interface Empresa {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  idEmpresa: number;
}

export interface Parqueadero {
  id: number;
  nombre: string;
  capacidadTotal: number;
  ubicacion: string;
  idEmpresa: number;
}

export interface Celda {
  id: number;
  idParqueadero: number;
  idTipoCelda: number;
  idSensor: number;
  estado: string;
}

export interface TipoVehiculo {
  id: number;
  nombre: string;
}

export interface Vehiculo {
  id: number;
  placa: string;
  idTipoVehiculo: number;
  tipoVehiculo?: TipoVehiculo;
}

export interface Reserva {
  id: number;
  idCelda: number;
  idVehiculo: number;
  fechaEntrada: string;
  fechaSalida?: string;
  estado: string;
  monto?: number;
  celda?: Celda;
  vehiculo?: Vehiculo;
}

export interface Tarifa {
  id: number;
  idParqueadero: number;
  idTipoVehiculo: number;
  precioFraccionHora: number;
  precioHoraAdicional?: number;
  parqueadero?: Parqueadero;
  tipoVehiculo?: TipoVehiculo;
}

export interface MetodoPago {
  id: number;
  nombre: string;
}

export interface Pago {
  id: number;
  idReserva: number;
  idMetodoPago: number;
  monto: number;
  fechaPago: string;
  reserva?: Reserva;
  metodoPago?: MetodoPago;
}

export interface ClienteFactura {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
}

export interface FacturaElectronica {
  id: number;
  idPago: number;
  idClienteFactura: number;
  cufe: string;
  urlPdf?: string;
  enviada: boolean;
  fechaEmision: string;
  pago?: Pago;
  clienteFactura?: ClienteFactura;
}

export interface Reporte {
  id: number;
  idParqueadero: number;
  idPeriodo: number;
  urlArchivo?: string;
  fechaGeneracion: string;
  parqueadero?: Parqueadero;
}

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
  tipoVehiculo: string;
  idCelda: number;
  parqueadero: string;
  fechaEntrada: string;
  fechaSalida?: string;
  estado: string;
}

export interface FacturacionCompleta {
  idFacturaElectronica: number;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  idPago: number;
  monto: number;
  metodoPago: string;
  fechaPago: string;
  cufe: string;
  urlPdf: string;
  enviada: number;
}

export interface IngresosMensuales {
  empresa: string;
  parqueadero: string;
  periodo: string;
  totalIngresos: number;
}
