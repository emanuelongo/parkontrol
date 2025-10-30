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

  async getOcupacionByEmpresa(idEmpresa: number): Promise<OcupacionParqueaderoView[]> {
    return await this.ocupacionRepo.find({
      where: { idEmpresa },
    });
  }

  async getOcupacionByParqueadero(idParqueadero: number): Promise<OcupacionParqueaderoView | null> {
    return await this.ocupacionRepo.findOne({
      where: { idParqueadero },
    });
  }

  async getHistorialByEmpresa(idEmpresa: number): Promise<HistorialReservasView[]> {
    return await this.historialRepo.find({
      where: { idEmpresa },
    });
  }

  async getHistorialByPlacaAndParqueadero(placa: string, idParqueadero: number): Promise<HistorialReservasView[]> {
    return await this.historialRepo.find({
      where: { placa, idParqueadero },
    });
  }

  async getFacturacionByEmpresa(idEmpresa: number): Promise<FacturacionCompletaView[]> {
    return await this.facturacionRepo.find({
      where: { idEmpresa },
    });
  }

  async getFacturacionByDocumento(numeroDocumento: string, idEmpresa: number): Promise<FacturacionCompletaView[]> {
    return await this.facturacionRepo.find({
      where: { numeroDocumento, idEmpresa },
    });
  }

  async getIngresosByEmpresa(idEmpresa: number): Promise<IngresosPorParqueaderoMensualView[]> {
    return await this.ingresosRepo.find({
      where: { idEmpresa },
    });
  }

  async getIngresosByParqueadero(idParqueadero: number): Promise<IngresosPorParqueaderoMensualView[]> {
    return await this.ingresosRepo.find({
      where: { idParqueadero },
    });
  }

  async getIngresosByPeriodo(periodo: string, idEmpresa: number): Promise<IngresosPorParqueaderoMensualView[]> {
    return await this.ingresosRepo.find({
      where: { periodo, idEmpresa },
    });
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
