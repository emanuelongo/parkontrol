import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, NotFoundException } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './entities/dto/crear-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';
import { Roles } from 'src/shared/decorators';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { JwtAuthGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/shared/guards';

@Controller('vehicles')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async crear(@Body() createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    return await this.vehiculosService.crear(createVehiculoDto);
  }

  @Get('placa/:placa')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorPlaca(@Param('placa') placa: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculosService.findByPlaca(placa);
    if (!vehiculo) {
      throw new NotFoundException(`No existe vehículo con placa: ${placa}`);
    }
    return vehiculo;
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Vehiculo> {
    return await this.vehiculosService.findVehiculoById(id);
  }
}
