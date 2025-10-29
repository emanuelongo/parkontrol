import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { CeldasService } from './celdas.service';
import { CreateCeldaDto } from './entities/dto/crear-celda.dto';
import { Celda } from './entities/celda.entity';
import { Roles } from 'src/shared/decorators';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { JwtAuthGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import type { JwtUsuario } from 'src/auth/interfaces';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

@Controller('cells')
export class CeldasController {
  constructor(
    private readonly celdasService: CeldasService,
    private readonly parqueaderosService: ParqueaderosService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async crear(@Body() createCeldaDto: CreateCeldaDto, @GetUser() user: JwtUsuario): Promise<Celda> {
    // Verify that the parqueadero belongs to the authenticated user's company
  const parqueadero = await this.parqueaderosService.findParqueaderoById(createCeldaDto.idParqueadero);
    if (parqueadero.empresa.id !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `Admin user (empresa ${user.idEmpresa}) cannot create a cell in parqueadero belonging to empresa ${parqueadero.empresa.id}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }

    return await this.celdasService.crear(createCeldaDto);
  }

  @Get('parqueadero/:idParqueadero')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Celda[]> {
    return await this.celdasService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Celda> {
    return await this.celdasService.findCeldaById(id);
  }

  @Patch(':id/estado')
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
    @GetUser() user: JwtUsuario
  ): Promise<Celda> {
    // Ensure the celda belongs to the user's company
    const celda = await this.celdasService.findCeldaById(id);
    if (celda.parqueadero.empresa.id !== user.idEmpresa) {
      throw new ForbiddenException({
        message: `User from empresa ${user.idEmpresa} cannot update estado of celda in empresa ${celda.parqueadero.empresa.id}`,
        error: 'Forbidden',
        statusCode: 403,
      });
    }
    return await this.celdasService.actualizarEstado(id, estado);
  }
}
