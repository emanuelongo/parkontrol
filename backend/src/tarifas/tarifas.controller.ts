import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { TarifasService } from './tarifas.service';
import { CreateTarifaDto } from './entities/dto/crear-tarifa.dto';
import { Tarifa } from './entities/tarifa.entity';
import { Roles } from 'src/shared/decorators';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { JwtAuthGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import type { JwtUsuario } from 'src/auth/interfaces';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

@Controller('rates')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService, private readonly parqueaderosService: ParqueaderosService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async crear(@Body() createTarifaDto: CreateTarifaDto, @GetUser() user: JwtUsuario): Promise<Tarifa> {
    // verify parqueadero belongs to user's company
    const parqueadero = await this.parqueaderosService.findParqueaderoById(createTarifaDto.idParqueadero);
    if (parqueadero.empresa.id !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot create tarifa for parqueadero in empresa ${parqueadero.empresa.id}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }

    return await this.tarifasService.crear(createTarifaDto);
  }

  @Get('parqueadero/:idParqueadero')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Tarifa[]> {
    return await this.tarifasService.findByParqueadero(idParqueadero);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateTarifaDto>,
    @GetUser() user: JwtUsuario,
  ): Promise<Tarifa> {
    // ensure tarifa belongs to user's company
    const tarifa = await this.tarifasService.findTarifaById(id);
    if (tarifa.parqueadero.empresa.id !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot update tarifa belonging to empresa ${tarifa.parqueadero.empresa.id}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }
    return await this.tarifasService.actualizar(id, updateData);
  }
}
