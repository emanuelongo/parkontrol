import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './entities/dto/crear-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { UsuarioResponseDto } from './entities/dto/usuario-response.dto';

@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly usuariosService: UsuariosService){}

    @Post()
    @Roles(RoleEnum.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async crear(@Body() createUsuarioDto: CreateUsuarioDto): Promise<UsuarioResponseDto>{
        return await this.usuariosService.crear(createUsuarioDto, RoleEnum.OPERADOR);
    }

    @Delete(':id')
    @Roles(RoleEnum.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async eliminar(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
        await this.usuariosService.eliminar(id);
        return { mensaje: 'Usuario Operador eliminado correctamente' };
    }
}
