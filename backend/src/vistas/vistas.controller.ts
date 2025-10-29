import { Controller, Get, Param, Post, Body, UseGuards, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { VistasService } from './vistas.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { GetUser, Roles } from 'src/shared/decorators';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import type { JwtUsuario } from 'src/auth/interfaces';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';

@Controller('views')
export class VistasController {
  constructor(private readonly vistasService: VistasService) {}

  // Ocupación de parqueaderos
  @Get('ocupacion')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOcupacionParqueaderos(@GetUser() user: JwtUsuario) {
    const ocupaciones = await this.vistasService.getOcupacionParqueaderos();
    // Filter by user's company
    return ocupaciones.filter(o => o.nombreEmpresa === user.idEmpresa?.toString());
  }

  @Get('ocupacion/:idParqueadero')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOcupacionByParqueadero(
    @Param('idParqueadero', ParseIntPipe) idParqueadero: number,
    @GetUser() user: JwtUsuario,
  ) {
    const ocupacion = await this.vistasService.getOcupacionByParqueadero(idParqueadero);
    if (!ocupacion) {
      throw new ForbiddenException({
        message: `No parking lot found with id ${idParqueadero}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }
    return ocupacion;
  }

  // Historial de reservas
  @Get('historial-reservas')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getHistorialReservas() {
    return await this.vistasService.getHistorialReservas();
  }

  @Get('historial-reservas/placa/:placa')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getHistorialByPlaca(@Param('placa') placa: string) {
    return await this.vistasService.getHistorialByPlaca(placa);
  }

  // Facturación completa
  @Get('facturacion')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFacturacionCompleta() {
    return await this.vistasService.getFacturacionCompleta();
  }

  @Get('facturacion/documento/:numeroDocumento')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFacturacionByDocumento(@Param('numeroDocumento') numeroDocumento: string) {
    return await this.vistasService.getFacturacionByDocumento(numeroDocumento);
  }

  // Ingresos mensuales
  @Get('ingresos')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getIngresosMensuales(@GetUser() user: JwtUsuario) {
    return await this.vistasService.getIngresosMensuales();
  }

  @Get('ingresos/parqueadero/:parqueadero')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getIngresosByParqueadero(@Param('parqueadero') parqueadero: string) {
    return await this.vistasService.getIngresosByParqueadero(parqueadero);
  }

  @Get('ingresos/periodo/:periodo')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getIngresosByPeriodo(@Param('periodo') periodo: string) {
    return await this.vistasService.getIngresosByPeriodo(periodo);
  }

  // Procedimientos almacenados
  @Post('procesar-pago')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async procesarPago(
    @Body() procesarPagoDto: ProcesarPagoDto,
    @GetUser() user: JwtUsuario,
  ) {
    return await this.vistasService.procesarPago(procesarPagoDto.idReserva, procesarPagoDto.idMetodoPago);
  }

  @Get('buscar-vehiculo/:placa')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async buscarVehiculoPorPlaca(@Param('placa') placa: string) {
    return await this.vistasService.buscarVehiculoPorPlaca(placa);
  }
}
