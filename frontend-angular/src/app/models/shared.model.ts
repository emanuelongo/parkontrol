export enum RolUsuario {
  ADMINISTRADOR = 'ADMINISTRADOR',
  OPERADOR = 'OPERADOR'
}


export interface Empresa {
  id: number;
  nombre: string;
}


export interface TipoVehiculo {
  id: number;
  nombre: string;
}


export interface TipoCelda {
  id: number;
  nombre: string;
}

export enum EstadoCelda {
  LIBRE = 'LIBRE',
  OCUPADA = 'OCUPADA'
}

export enum EstadoReserva {
  ABIERTA = 'ABIERTA',
  FINALIZADA = 'FINALIZADA',
}

export interface Sensor {
  id: number;
  codigo: string;
  tipo: string;
}

export enum MetodoPago {
  EFECTIVO = 1,
  TARJETA_CREDITO = 2,
  TARJETA_DEBITO = 3,
  TRANSFERENCIA = 4
}

export interface MetodoPagoInfo {
  id: number;
  nombre: string;
}

export interface Periodo {
  id: number;
  nombre: string;
}