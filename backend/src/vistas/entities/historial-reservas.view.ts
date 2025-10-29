import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'VW_HISTORIAL_RESERVAS',
  expression: `
    SELECT 
      r.id_reserva, 
      v.placa, 
      tv.nombre AS tipo_vehiculo, 
      c.id_celda, 
      p.nombre AS parqueadero, 
      r.fecha_entrada, 
      r.fecha_salida, 
      r.estado 
    FROM RESERVA r 
    JOIN VEHICULO v ON r.id_vehiculo = v.id_vehiculo 
    JOIN TIPO_VEHICULO tv ON v.id_tipo_vehiculo = tv.id_tipo_vehiculo 
    JOIN CELDA c ON r.id_celda = c.id_celda 
    JOIN PARQUEADERO p ON c.id_parqueadero = p.id_parqueadero
  `
})
export class HistorialReservasView {
  @ViewColumn({ name: 'ID_RESERVA' })
  idReserva: number;

  @ViewColumn({ name: 'PLACA' })
  placa: string;

  @ViewColumn({ name: 'TIPO_VEHICULO' })
  tipoVehiculo: string;

  @ViewColumn({ name: 'ID_CELDA' })
  idCelda: number;

  @ViewColumn({ name: 'PARQUEADERO' })
  parqueadero: string;

  @ViewColumn({ name: 'FECHA_ENTRADA' })
  fechaEntrada: Date;

  @ViewColumn({ name: 'FECHA_SALIDA' })
  fechaSalida: Date;

  @ViewColumn({ name: 'ESTADO' })
  estado: string;
}
