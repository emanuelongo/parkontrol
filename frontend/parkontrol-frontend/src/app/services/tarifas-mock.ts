import { Tarifa } from "../shared/interfaces/tarifa.interface";
import { TipoVehiculo } from "../shared/interfaces/tipo-vehiculo.interface";


export const TARIFAS_MOCK: Tarifa[] = [
  {
    id: 1,
    idParqueadero: 1,
    tipoVehiculo: { id: 1, nombre: 'Carro' },
    precioFraccionHora: 2000,
    precioHoraAdicional: 1500,
  },
  {
    id: 2,
    idParqueadero: 1,
    tipoVehiculo: { id: 2, nombre: 'Moto' },
    precioFraccionHora: 1000,
    precioHoraAdicional: 800,
  },
];

export const TIPOS_VEHICULO_MOCK: TipoVehiculo[] = [
  {
    id: 1,
    nombre: 'Carro',
  },
  {
    id: 2,
    nombre: 'Moto',
  },
  {
    id: 3,
    nombre: 'Bicicleta',
  },
  {
    id: 4,
    nombre: 'Camión',
  },
  {
    id: 5,
    nombre: 'Bus',
  },
];
