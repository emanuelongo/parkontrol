import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrarUsuarioDto } from './entities/dto/registrar-usuario.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { LoginUsuarioDto } from './entities/dto/login-usuario.dto';
import { LoginResponseDto } from './entities/dto/login-response.dto';
import { UsuarioResponseDto } from 'src/usuarios/entities/dto/usuario-response.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('registrar')
    async registerClient( @Body() registrarUsuarioDto: RegistrarUsuarioDto): Promise<UsuarioResponseDto>{
        return await this.authService.registrar(registrarUsuarioDto);
    }

    @Post('login')
    async login(@Body() loginUsuarioDto : LoginUsuarioDto): Promise<LoginResponseDto>{
        return await this.authService.login(loginUsuarioDto);
    }
}
