import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { OcupacionParqueaderoView } from './entities/ocupacion-parqueadero.view';
import { HistorialReservasView } from './entities/historial-reservas.view';
import { FacturacionCompletaView } from './entities/facturacion-completa.view';
import { IngresosPorParqueaderoMensualView } from './entities/ingresos-parqueadero-mensual.view';

export interface ProcControlPagoResult {
  monto: number;
}

export interface ProcBuscarPlacaResult {
  mensaje: string;
}

@Injectable()
export class VistasService {
  constructor(
    @InjectRepository(OcupacionParqueaderoView)
    private readonly ocupacionRepo: Repository<OcupacionParqueaderoView>,
    @InjectRepository(HistorialReservasView)
    private readonly historialRepo: Repository<HistorialReservasView>,
    @InjectRepository(FacturacionCompletaView)
    private readonly facturacionRepo: Repository<FacturacionCompletaView>,
    @InjectRepository(IngresosPorParqueaderoMensualView)
    private readonly ingresosRepo: Repository<IngresosPorParqueaderoMensualView>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getOcupacionByEmpresa(idEmpresa: number | null): Promise<any[]> {
    if (idEmpresa === null) {
      return await this.dataSource.query(`SELECT * FROM VW_OCUPACION_PARQUEADERO`);
    }
    
    return await this.dataSource.query(
      `SELECT v.* FROM VW_OCUPACION_PARQUEADERO v 
       JOIN PARQUEADERO p ON v.ID_PARQUEADERO = p.ID_PARQUEADERO 
       WHERE p.ID_EMPRESA = :1`,
      [idEmpresa]
    );
  }

  async getOcupacionByParqueadero(idParqueadero: number): Promise<any> {
    const result = await this.dataSource.query(
      `SELECT * FROM VW_OCUPACION_PARQUEADERO WHERE ID_PARQUEADERO = :1`,
      [idParqueadero]
    );
    return result[0] || null;
  }

  async getHistorialByEmpresa(idEmpresa: number | null): Promise<any[]> {
    if (idEmpresa === null) {
      return await this.dataSource.query(`SELECT * FROM VW_HISTORIAL_RESERVAS`);
    }
    
    return await this.dataSource.query(
      `SELECT v.* FROM VW_HISTORIAL_RESERVAS v 
       JOIN CELDA c ON v.ID_CELDA = c.ID_CELDA 
       JOIN PARQUEADERO p ON c.ID_PARQUEADERO = p.ID_PARQUEADERO 
       WHERE p.ID_EMPRESA = :1`,
      [idEmpresa]
    );
  }

  async getHistorialByPlacaAndParqueadero(placa: string, idParqueadero: number): Promise<any[]> {
    return await this.dataSource.query(
      `SELECT v.* FROM VW_HISTORIAL_RESERVAS v 
       JOIN CELDA c ON v.ID_CELDA = c.ID_CELDA 
       WHERE v.PLACA = :1 AND c.ID_PARQUEADERO = :2`,
      [placa, idParqueadero]
    );
  }

  async getFacturacionByEmpresa(idEmpresa: number | null): Promise<any[]> {
    if (idEmpresa === null) {
      return await this.dataSource.query(`SELECT * FROM VW_FACTURACION_COMPLETA`);
    }
    
    return await this.dataSource.query(
      `SELECT v.* FROM VW_FACTURACION_COMPLETA v 
       JOIN PAGO pg ON v.ID_PAGO = pg.ID_PAGO 
       JOIN RESERVA r ON pg.ID_RESERVA = r.ID_RESERVA 
       JOIN CELDA c ON r.ID_CELDA = c.ID_CELDA 
       JOIN PARQUEADERO p ON c.ID_PARQUEADERO = p.ID_PARQUEADERO 
       WHERE p.ID_EMPRESA = :1`,
      [idEmpresa]
    );
  }

  async getFacturacionByDocumento(numeroDocumento: string, idEmpresa: number | null): Promise<any[]> {
    if (idEmpresa === null) {
      return await this.dataSource.query(
        `SELECT * FROM VW_FACTURACION_COMPLETA WHERE NUMERO_DOCUMENTO = :1`,
        [numeroDocumento]
      );
    }
    
    return await this.dataSource.query(
      `SELECT v.* FROM VW_FACTURACION_COMPLETA v 
       JOIN PAGO pg ON v.ID_PAGO = pg.ID_PAGO 
       JOIN RESERVA r ON pg.ID_RESERVA = r.ID_RESERVA 
       JOIN CELDA c ON r.ID_CELDA = c.ID_CELDA 
       JOIN PARQUEADERO p ON c.ID_PARQUEADERO = p.ID_PARQUEADERO 
       WHERE v.NUMERO_DOCUMENTO = :1 AND p.ID_EMPRESA = :2`,
      [numeroDocumento, idEmpresa]
    );
  }

  async getIngresosByEmpresa(idEmpresa: number | null): Promise<any[]> {
    if (idEmpresa === null) {
      return await this.dataSource.query(`SELECT * FROM VW_INGRESOS_POR_PARQUEADERO_MENSUAL`);
    }
    
    return await this.dataSource.query(
      `SELECT v.* FROM VW_INGRESOS_POR_PARQUEADERO_MENSUAL v 
       JOIN PARQUEADERO p ON v.PARQUEADERO = p.NOMBRE 
       WHERE p.ID_EMPRESA = :1`,
      [idEmpresa]
    );
  }

  async getIngresosByParqueadero(idParqueadero: number): Promise<any[]> {
    return await this.dataSource.query(
      `SELECT v.* FROM VW_INGRESOS_POR_PARQUEADERO_MENSUAL v 
       JOIN PARQUEADERO p ON v.PARQUEADERO = p.NOMBRE 
       WHERE p.ID_PARQUEADERO = :1`,
      [idParqueadero]
    );
  }

  async procesarPago(
    idReserva: number,
    idMetodoPago: number,
  ): Promise<ProcControlPagoResult> {
    const query = `
      DECLARE
        v_monto NUMBER;
      BEGIN
        PKG_CENTRAL.PROC_CONTROL_PAGO(
          p_id_reserva => :idReserva,
          p_id_metodo_pago => :idMetodoPago,
          p_monto => v_monto
        );
        :result := v_monto;
      END;
    `;

    const result = await this.dataSource.query(
      query,
      [idReserva, idMetodoPago, { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }]
    );

    return { monto: result };
  }

  async buscarVehiculoPorPlaca(placa: string): Promise<ProcBuscarPlacaResult> {
    const query = `
      DECLARE
        v_mensaje VARCHAR2(500);
      BEGIN
        PKG_CENTRAL.PROC_BUSCAR_PLACA(
          p_placa => :placa,
          p_mensaje => v_mensaje
        );
        :result := v_mensaje;
      END;
    `;

    const result = await this.dataSource.query(
      query,
      [placa, { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }]
    );

    return { mensaje: result };
  }
}
