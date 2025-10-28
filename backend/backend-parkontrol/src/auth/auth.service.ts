import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegistrarUsuarioDto } from './entities/dto/registrar-usuario.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import * as bcrypt from 'bcrypt';
import { LoginUsuarioDto } from './entities/dto/login-usuario.dto';
import { LoginResponseDto } from './entities/dto/login-response.dto';
import { UsuarioResponseDto } from 'src/usuarios/entities/dto/usuario-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usuariosService: UsuariosService,
    ){}

    async registrar(registrarUsuarioDto: RegistrarUsuarioDto): Promise<UsuarioResponseDto>{
        return await this.usuariosService.crear(registrarUsuarioDto, RoleEnum.ADMIN);
    }

    private async validarUsuario(correo: string, contrasena: string): Promise<Usuario | null>{
        const usuario = await this.usuariosService.findUsuarioByCorreo(correo);
        if(usuario && await bcrypt.compare(contrasena, usuario?.contrasena)){
            return usuario;
        }
        return null;
    }

    async login(loginUsuarioDto: LoginUsuarioDto): Promise<LoginResponseDto> {
        const usuarioValido = await this.validarUsuario(loginUsuarioDto.correo, loginUsuarioDto.contrasena);
        if (!usuarioValido){
            throw new UnauthorizedException('email o password invalidos');
        }
        const payload = {
            id: usuarioValido.id,
            correo: usuarioValido.correo,
            nombreRol: usuarioValido.rol.nombre,
            idEmpresa: usuarioValido.empresa?.id ?? null,
            idParqueadero: usuarioValido.parqueadero?.id ?? null,
        };
        return {access_token: this.jwtService.sign(payload)}  
    }
}
