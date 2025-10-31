import { Body, Controller, Get, Param, ParseIntPipe, Post, NotFoundException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './entities/dto/crear-pago.dto';
import { Pago } from './entities/pago.entity';
// import { Roles } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import { RoleEnum } from 'src/shared/entities/rol.entity'; // REMOVED FOR BackendSinAuth
// import { JwtAuthGuard } from 'src/auth/guards'; // REMOVED FOR BackendSinAuth
// import { RolesGuard } from 'src/shared/guards'; // REMOVED FOR BackendSinAuth
// import { GetUser } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import type { JwtUsuario } from 'src/auth/interfaces'; // REMOVED FOR BackendSinAuth
import { ReservasService } from 'src/reservas/reservas.service';

@Controller('payments')
export class PagosController {
  constructor(private readonly pagosService: PagosService, private readonly reservasService: ReservasService) {}

  @Post()
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async crear(@Body() createPagoDto: CreatePagoDto): Promise<Pago> {
    // No security validation
    return await this.pagosService.crear(createPagoDto);
  }

  @Get('parqueadero/:idParqueadero')
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Pago[]> {
    return await this.pagosService.findByParqueadero(idParqueadero);
  }

  @Get('reserva/:idReserva')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorReserva(@Param('idReserva', ParseIntPipe) idReserva: number): Promise<Pago> {
    const pago = await this.pagosService.findByReserva(idReserva);
    if (!pago) {
      throw new NotFoundException(`No existe pago para la reserva con id: ${idReserva}`);
    }
    return pago;
  }

  @Get(':id')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Pago> {
    return await this.pagosService.findPagoById(id);
  }
}
