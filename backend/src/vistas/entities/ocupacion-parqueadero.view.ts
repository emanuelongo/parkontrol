import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'VW_OCUPACION_PARQUEADERO',
  expression: `
    SELECT 
      p.id_parqueadero, 
      p.nombre AS nombre_parqueadero, 
      e.nombre AS nombre_empresa, 
      COUNT(c.id_celda) AS total_celdas, 
      SUM(CASE WHEN c.estado = 'OCUPADA' THEN 1 ELSE 0 END) AS celdas_ocupadas, 
      SUM(CASE WHEN c.estado = 'LIBRE' THEN 1 ELSE 0 END) AS celdas_libres 
    FROM PARQUEADERO p 
    JOIN EMPRESA e ON p.id_empresa = e.id_empresa 
    JOIN CELDA c ON p.id_parqueadero = c.id_parqueadero 
    GROUP BY p.id_parqueadero, p.nombre, e.nombre
  `
})
export class OcupacionParqueaderoView {
  @ViewColumn({ name: 'ID_PARQUEADERO' })
  idParqueadero: number;

  @ViewColumn({ name: 'NOMBRE_PARQUEADERO' })
  nombreParqueadero: string;

  @ViewColumn({ name: 'NOMBRE_EMPRESA' })
  nombreEmpresa: string;

  @ViewColumn({ name: 'TOTAL_CELDAS' })
  totalCeldas: number;

  @ViewColumn({ name: 'CELDAS_OCUPADAS' })
  celdasOcupadas: number;

  @ViewColumn({ name: 'CELDAS_LIBRES' })
  celdasLibres: number;
}
