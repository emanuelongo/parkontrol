import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'VW_INGRESOS_POR_PARQUEADERO_MENSUAL',
  expression: `
    SELECT 
      e.id_empresa,
      e.nombre AS empresa,
      p.id_parqueadero,
      p.nombre AS parqueadero, 
      TO_CHAR(pg.fecha_pago, 'YYYY-MM') AS periodo, 
      SUM(pg.monto) AS total_ingresos 
    FROM PAGO pg 
    JOIN RESERVA r ON pg.id_reserva = r.id_reserva 
    JOIN CELDA c ON r.id_celda = c.id_celda 
    JOIN PARQUEADERO p ON c.id_parqueadero = p.id_parqueadero 
    JOIN EMPRESA e ON p.id_empresa = e.id_empresa 
    GROUP BY e.id_empresa, e.nombre, p.id_parqueadero, p.nombre, TO_CHAR(pg.fecha_pago, 'YYYY-MM')
  `
})
export class IngresosPorParqueaderoMensualView {
  @ViewColumn({ name: 'ID_EMPRESA' })
  idEmpresa: number;

  @ViewColumn({ name: 'EMPRESA' })
  empresa: string;

  @ViewColumn({ name: 'ID_PARQUEADERO' })
  idParqueadero: number;

  @ViewColumn({ name: 'PARQUEADERO' })
  parqueadero: string;

  @ViewColumn({ name: 'PERIODO' })
  periodo: string;

  @ViewColumn({ name: 'TOTAL_INGRESOS' })
  totalIngresos: number;
}
