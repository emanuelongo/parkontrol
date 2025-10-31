import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './entities/dto/crear-empresa.dto';
import { EmpresaResponseDto } from './entities/dto/empresa-response.dto';

@Controller('companies')
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService){}

    @Get()
    async obtenerTodas(): Promise<EmpresaResponseDto[]> {
        return this.empresasService.obtenerTodas();
    }

    @Get(':id')
    async obtenerDetalle(@Param('id') idEmpresa: number): Promise<EmpresaResponseDto> {
        return this.empresasService.obtenerDetalle(idEmpresa);
    }
}
