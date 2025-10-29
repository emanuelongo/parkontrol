import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { RolesGuard } from 'src/shared/guards';
import { GetUser, Roles } from 'src/shared/decorators';
import type { JwtUsuario } from 'src/auth/interfaces';
import { JwtAuthGuard } from 'src/auth/guards';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { CreateEmpresaDto } from './entities/dto/crear-empresa.dto';
import { EmpresaResponseDto } from './entities/dto/empresa-response.dto';

@Controller('companies')
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService){}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async obtenerDetalle(@GetUser() user: JwtUsuario): Promise<EmpresaResponseDto> {
        return this.empresasService.obtenerDetalle(user.idEmpresa!);
    }
}
