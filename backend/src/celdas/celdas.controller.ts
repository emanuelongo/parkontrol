import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CeldasService } from './celdas.service';
import { CreateCeldaDto } from './entities/dto/crear-celda.dto';
import { Celda } from './entities/celda.entity';
// import { Roles } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import { RoleEnum } from 'src/shared/entities/rol.entity'; // REMOVED FOR BackendSinAuth
// import { JwtAuthGuard } from 'src/auth/guards'; // REMOVED FOR BackendSinAuth
// import { RolesGuard } from 'src/shared/guards'; // REMOVED FOR BackendSinAuth
// import { GetUser } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import type { JwtUsuario } from 'src/auth/interfaces'; // REMOVED FOR BackendSinAuth
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

@Controller('cells')
export class CeldasController {
  constructor(
    private readonly celdasService: CeldasService,
    private readonly parqueaderosService: ParqueaderosService,
  ) {}

  @Post()
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async crear(@Body() createCeldaDto: CreateCeldaDto): Promise<Celda> {
    // No security validation
    return await this.celdasService.crear(createCeldaDto);
  }

  @Get('parqueadero/:idParqueadero')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Celda[]> {
    return await this.celdasService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Celda> {
    return await this.celdasService.findCeldaById(id);
  }

  @Patch(':id/estado')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string
  ): Promise<Celda> {
    // No security validation
    return await this.celdasService.actualizarEstado(id, estado);
  }
}
