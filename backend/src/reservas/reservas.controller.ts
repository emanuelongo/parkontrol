import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './entities/dto/crear-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { Roles } from 'src/shared/decorators';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { JwtAuthGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import type { JwtUsuario } from 'src/auth/interfaces';
import { CeldasService } from 'src/celdas/celdas.service';

@Controller('reservations')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService, private readonly celdasService: CeldasService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async crear(@Body() createReservaDto: CreateReservaDto, @GetUser() user: JwtUsuario): Promise<Reserva> {
    // ensure the celda belongs to the user's company
    const celda = await this.celdasService.findCeldaById(createReservaDto.idCelda);
    if (celda.parqueadero.empresa.id !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot create reservation on celda belonging to empresa ${celda.parqueadero.empresa.id}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }
    return await this.reservasService.crear(createReservaDto);
  }

  @Patch(':id/finalizar')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async finalizar(@Param('id', ParseIntPipe) id: number, @GetUser() user: JwtUsuario): Promise<Reserva> {
    const reserva = await this.reservasService.findReservaById(id);
    if (reserva.celda.parqueadero.id && reserva.celda.parqueadero.empresa.id !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot finalize reservation for empresa ${reserva.celda.parqueadero.empresa.id}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }
    return await this.reservasService.finalizarReserva(id);
  }

  @Get('activas')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerActivas(): Promise<Reserva[]> {
    return await this.reservasService.findActivas();
  }

  @Get('parqueadero/:idParqueadero')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Reserva[]> {
    return await this.reservasService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Reserva> {
    return await this.reservasService.findReservaById(id);
  }
}
