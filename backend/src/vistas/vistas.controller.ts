import { Controller, Get, Param, Post, Body, UseGuards, ForbiddenException, ParseIntPipe, NotFoundException } from '@nestjs/common';
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

  @Get('ocupacion')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOcupacionParqueaderos(@GetUser() user: JwtUsuario) {
    return await this.vistasService.getOcupacionByEmpresa(user.idEmpresa);
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
      throw new NotFoundException({
        message: `No occupation data found for parking lot ${idParqueadero}`,
        error: 'Not Found',
        statusCode: 404,
      });
    }

    if (ocupacion.idEmpresa !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot access parking lot from empresa ${ocupacion.idEmpresa}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }

    return ocupacion;
  }

  @Get('historial-reservas')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getHistorialReservas(@GetUser() user: JwtUsuario) {
    return await this.vistasService.getHistorialByEmpresa(user.idEmpresa);
  }

  @Get('historial-reservas/parqueadero/:idParqueadero/placa/:placa')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getHistorialByPlacaAndParqueadero(
    @Param('idParqueadero', ParseIntPipe) idParqueadero: number,
    @Param('placa') placa: string,
    @GetUser() user: JwtUsuario,
  ) {
    const ocupacion = await this.vistasService.getOcupacionByParqueadero(idParqueadero);
    
    if (!ocupacion) {
      throw new NotFoundException({
        message: `Parking lot ${idParqueadero} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    }

    if (ocupacion.idEmpresa !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot access reservations from empresa ${ocupacion.idEmpresa}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }

    return await this.vistasService.getHistorialByPlacaAndParqueadero(placa, idParqueadero);
  }

  @Get('facturacion')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFacturacionCompleta(@GetUser() user: JwtUsuario) {
    return await this.vistasService.getFacturacionByEmpresa(user.idEmpresa);
  }

  @Get('facturacion/documento/:numeroDocumento')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFacturacionByDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
    @GetUser() user: JwtUsuario,
  ) {
    return await this.vistasService.getFacturacionByDocumento(numeroDocumento, user.idEmpresa);
  }

  @Get('ingresos')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getIngresosMensuales(@GetUser() user: JwtUsuario) {
    return await this.vistasService.getIngresosByEmpresa(user.idEmpresa);
  }

  @Get('ingresos/parqueadero/:idParqueadero')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getIngresosByParqueadero(
    @Param('idParqueadero', ParseIntPipe) idParqueadero: number,
    @GetUser() user: JwtUsuario,
  ) {
    const ocupacion = await this.vistasService.getOcupacionByParqueadero(idParqueadero);
    
    if (!ocupacion) {
      throw new NotFoundException({
        message: `Parking lot ${idParqueadero} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    }

    if (ocupacion.idEmpresa !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot access income data from empresa ${ocupacion.idEmpresa}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }

    return await this.vistasService.getIngresosByParqueadero(idParqueadero);
  }

  @Get('ingresos/periodo/:periodo')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getIngresosByPeriodo(
    @Param('periodo') periodo: string,
    @GetUser() user: JwtUsuario,
  ) {
    return await this.vistasService.getIngresosByPeriodo(periodo, user.idEmpresa);
  }

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
