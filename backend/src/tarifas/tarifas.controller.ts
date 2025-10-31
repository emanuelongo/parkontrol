import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TarifasService } from './tarifas.service';
import { CreateTarifaDto } from './entities/dto/crear-tarifa.dto';
import { Tarifa } from './entities/tarifa.entity';
// import { Roles } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import { RoleEnum } from 'src/shared/entities/rol.entity'; // REMOVED FOR BackendSinAuth
// import { JwtAuthGuard } from 'src/auth/guards'; // REMOVED FOR BackendSinAuth
// import { RolesGuard } from 'src/shared/guards'; // REMOVED FOR BackendSinAuth
// import { GetUser } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import type { JwtUsuario } from 'src/auth/interfaces'; // REMOVED FOR BackendSinAuth
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

@Controller('rates')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService, private readonly parqueaderosService: ParqueaderosService) {}

  @Post()
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async crear(@Body() createTarifaDto: CreateTarifaDto): Promise<Tarifa> {
    // No security validation
    return await this.tarifasService.crear(createTarifaDto);
  }

  @Get('parqueadero/:idParqueadero')
  // @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Tarifa[]> {
    return await this.tarifasService.findByParqueadero(idParqueadero);
  }

  @Patch(':id')
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateTarifaDto>
  ): Promise<Tarifa> {
    // No security validation
    return await this.tarifasService.actualizar(id, updateData);
  }
}
