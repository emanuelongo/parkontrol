import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './entities/dto/crear-reserva.dto';
import { Reserva } from './entities/reserva.entity';
// import { Roles } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import { RoleEnum } from 'src/shared/entities/rol.entity'; // REMOVED FOR BackendSinAuth
// import { JwtAuthGuard } from 'src/auth/guards'; // REMOVED FOR BackendSinAuth
// import { RolesGuard } from 'src/shared/guards'; // REMOVED FOR BackendSinAuth
// import { GetUser } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import type { JwtUsuario } from 'src/auth/interfaces'; // REMOVED FOR BackendSinAuth
import { CeldasService } from 'src/celdas/celdas.service';

@Controller('reservations')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService, private readonly celdasService: CeldasService) {}

  @Post()
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async crear(@Body() createReservaDto: CreateReservaDto): Promise<Reserva> {
    // No security validation
    return await this.reservasService.crear(createReservaDto);
  }

  @Patch(':id/finalizar')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async finalizar(@Param('id', ParseIntPipe) id: number): Promise<Reserva> {
    // No security validation
    return await this.reservasService.finalizarReserva(id);
  }

  @Get('activas')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerActivas(): Promise<Reserva[]> {
    return await this.reservasService.findActivas();
  }

  @Get('parqueadero/:idParqueadero')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Reserva[]> {
    return await this.reservasService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Reserva> {
    return await this.reservasService.findReservaById(id);
  }
}
