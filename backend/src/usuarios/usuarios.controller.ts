import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './entities/dto/crear-usuario.dto';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { GetUser, Roles } from 'src/shared/decorators';
import { RolesGuard } from 'src/shared/guards';
import { UsuarioResponseDto } from './entities/dto/usuario-response.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import type { JwtUsuario } from 'src/auth/interfaces';

@Controller('users')
export class UsuariosController {

    constructor(private readonly usuariosService: UsuariosService){}

    @Post()
    @Roles(RoleEnum.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async crear(
        @Body() createUsuarioDto: CreateUsuarioDto,
        @GetUser() user: JwtUsuario
    ): Promise<UsuarioResponseDto> {
        createUsuarioDto.idEmpresa = user.idEmpresa!;
        return await this.usuariosService.crear(createUsuarioDto, RoleEnum.OPERADOR);
    }

    @Get('empresa')
    @Roles(RoleEnum.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async obtenerUsuariosEmpresa(@GetUser() user: JwtUsuario): Promise<UsuarioResponseDto[]> {
        return await this.usuariosService.findByEmpresa(user.idEmpresa!);
    }

    @Get(':id')
    @Roles(RoleEnum.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<UsuarioResponseDto> {
        const usuario = await this.usuariosService.findUsuarioById(id);
        return new UsuarioResponseDto(usuario);
    }

    @Delete(':id')
    @Roles(RoleEnum.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async eliminar(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
        await this.usuariosService.eliminar(id);
        return { mensaje: 'Usuario Operador eliminado correctamente' };
    }
}
