import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, NotFoundException, Query } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { CreateFacturaElectronicaDto } from './entities/dto/crear-factura-electronica.dto';
import { CreateClienteFacturaDto } from './entities/dto/crear-cliente-factura.dto';
import { FacturaElectronica } from './entities/factura-electronica.entity';
import { ClienteFactura } from './entities/cliente-factura.entity';
// import { Roles } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import { RoleEnum } from 'src/shared/entities/rol.entity'; // REMOVED FOR BackendSinAuth
// import { JwtAuthGuard } from 'src/auth/guards'; // REMOVED FOR BackendSinAuth
// import { RolesGuard } from 'src/shared/guards'; // REMOVED FOR BackendSinAuth

@Controller('invoicing')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post('clientes')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async crearCliente(@Body() createClienteDto: CreateClienteFacturaDto): Promise<ClienteFactura> {
    return await this.facturacionService.crearCliente(createClienteDto);
  }

  @Post('facturas')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async crearFactura(@Body() createFacturaDto: CreateFacturaElectronicaDto): Promise<FacturaElectronica> {
    return await this.facturacionService.crearFactura(createFacturaDto);
  }

  @Patch('facturas/:id/enviar')
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async marcarEnviada(@Param('id', ParseIntPipe) id: number): Promise<FacturaElectronica> {
    return await this.facturacionService.marcarComoEnviada(id);
  }

  @Get('facturas/pago/:idPago')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorPago(@Param('idPago', ParseIntPipe) idPago: number): Promise<FacturaElectronica> {
    const factura = await this.facturacionService.findByPago(idPago);
    if (!factura) {
      throw new NotFoundException(`No existe factura para el pago con id: ${idPago}`);
    }
    return factura;
  }

  
  @Get('clientes')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerClientes(): Promise<ClienteFactura[]> {
    return await this.facturacionService.obtenerClientes();
  }
}
