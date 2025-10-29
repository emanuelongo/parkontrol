import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './entities/dto/crear-pago.dto';
import { Pago } from './entities/pago.entity';
import { Roles } from 'src/shared/decorators';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { JwtAuthGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import type { JwtUsuario } from 'src/auth/interfaces';
import { ReservasService } from 'src/reservas/reservas.service';

@Controller('payments')
export class PagosController {
  constructor(private readonly pagosService: PagosService, private readonly reservasService: ReservasService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async crear(@Body() createPagoDto: CreatePagoDto, @GetUser() user: JwtUsuario): Promise<Pago> {
    // verify reservation belongs to user's company
    const reserva = await this.reservasService.findReservaById(createPagoDto.idReserva);
    if (reserva.celda.parqueadero.empresa.id !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot create payment for reservation in empresa ${reserva.celda.parqueadero.empresa.id}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }
    return await this.pagosService.crear(createPagoDto);
  }

  @Get('parqueadero/:idParqueadero')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Pago[]> {
    return await this.pagosService.findByParqueadero(idParqueadero);
  }

  @Get('reserva/:idReserva')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorReserva(@Param('idReserva', ParseIntPipe) idReserva: number): Promise<Pago> {
    const pago = await this.pagosService.findByReserva(idReserva);
    if (!pago) {
      throw new NotFoundException(`No existe pago para la reserva con id: ${idReserva}`);
    }
    return pago;
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Pago> {
    return await this.pagosService.findPagoById(id);
  }
}
