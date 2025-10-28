import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import type{ JwtUsuario } from 'src/auth/interfaces/jwt-usuario.interface';
import { CrearEmpresaDto } from './entities/dto/crear-empresa.dto';
import { EmpresaResponseDto } from './entities/dto/empresa-response.dto';

@Controller('empresas')
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService){}

    @Post()
    async crear(@Body() CrearEmpresaDto: CrearEmpresaDto): Promise<EmpresaResponseDto>{
        return await this.empresasService.crear(CrearEmpresaDto); 
    }

}
