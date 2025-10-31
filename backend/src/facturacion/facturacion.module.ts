import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturacionController } from './facturacion.controller';
import { FacturacionService } from './facturacion.service';
import { FacturaElectronica } from './entities/factura-electronica.entity';
import { ClienteFactura } from './entities/cliente-factura.entity';
import { PagosModule } from 'src/pagos/pagos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacturaElectronica, ClienteFactura]),
    PagosModule,
  ],
  controllers: [FacturacionController],
  providers: [FacturacionService],
  exports: [FacturacionService],
})
export class FacturacionModule {}
