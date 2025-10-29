import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'VW_FACTURACION_COMPLETA',
  expression: `
    SELECT 
      f.id_factura_electronica, 
      cf.tipo_documento, 
      cf.numero_documento, 
      cf.correo, 
      p.id_pago, 
      p.monto, 
      mp.nombre AS metodo_pago, 
      p.fecha_pago, 
      f.cufe, 
      f.url_pdf, 
      f.enviada 
    FROM FACTURA_ELECTRONICA f 
    JOIN CLIENTE_FACTURA cf ON f.id_cliente_factura = cf.id_cliente_factura 
    JOIN PAGO p ON f.id_pago = p.id_pago 
    JOIN METODO_PAGO mp ON p.id_metodo_pago = mp.id_metodo_pago
  `
})
export class FacturacionCompletaView {
  @ViewColumn({ name: 'ID_FACTURA_ELECTRONICA' })
  idFacturaElectronica: number;

  @ViewColumn({ name: 'TIPO_DOCUMENTO' })
  tipoDocumento: string;

  @ViewColumn({ name: 'NUMERO_DOCUMENTO' })
  numeroDocumento: string;

  @ViewColumn({ name: 'CORREO' })
  correo: string;

  @ViewColumn({ name: 'ID_PAGO' })
  idPago: number;

  @ViewColumn({ name: 'MONTO' })
  monto: number;

  @ViewColumn({ name: 'METODO_PAGO' })
  metodoPago: string;

  @ViewColumn({ name: 'FECHA_PAGO' })
  fechaPago: Date;

  @ViewColumn({ name: 'CUFE' })
  cufe: string;

  @ViewColumn({ name: 'URL_PDF' })
  urlPdf: string;

  @ViewColumn({ name: 'ENVIADA' })
  enviada: string;
}
