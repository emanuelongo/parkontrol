import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './entities/dto/crear-reporte.dto';
import { Reporte } from './entities/reporte.entity';
// import { Roles } from 'src/shared/decorators'; // REMOVED FOR BackendSinAuth
// import { RoleEnum } from 'src/shared/entities/rol.entity'; // REMOVED FOR BackendSinAuth
// import { JwtAuthGuard } from 'src/auth/guards'; // REMOVED FOR BackendSinAuth
// import { RolesGuard } from 'src/shared/guards'; // REMOVED FOR BackendSinAuth

@Controller('reports')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async crear(@Body() createReporteDto: CreateReporteDto): Promise<Reporte> {
    return await this.reportesService.crear(createReporteDto);
  }

  @Get('parqueadero/:idParqueadero')
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Reporte[]> {
    return await this.reportesService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Reporte> {
    return await this.reportesService.findReporteById(id);
  }

  @Patch(':id/url')
  // @Roles(RoleEnum.ADMIN) // REMOVED FOR BackendSinAuth
  // @UseGuards(JwtAuthGuard, RolesGuard) // REMOVED FOR BackendSinAuth
  async actualizarUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body('urlArchivo') urlArchivo: string
  ): Promise<Reporte> {
    return await this.reportesService.actualizarUrl(id, urlArchivo);
  }
}
