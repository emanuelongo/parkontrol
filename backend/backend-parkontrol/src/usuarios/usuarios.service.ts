import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { Rol, RoleEnum } from 'src/shared/entities/rol.entity';
import { CreateUsuarioDto } from './entities/dto/crear-usuario.dto';
import { RolesService } from 'src/shared/services/roles/roles.service';
import { UsuarioValidator } from './validators/usuario.validator';
import * as bcrypt from 'bcrypt';
import { UsuarioResponseDto } from './entities/dto/usuario-response.dto';
import { EmpresasService } from 'src/empresas/empresas.service';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(Usuario) 
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly usuarioValidator: UsuarioValidator,
        private readonly rolesService: RolesService,
        private readonly empresasService: EmpresasService

    ){}

    async crear(createUsuarioDto: CreateUsuarioDto, nombreRol: RoleEnum): Promise<UsuarioResponseDto>{
        await this.usuarioValidator.validarUsuarioUnico(createUsuarioDto.correo);
        const rol= await  this.rolesService.findRoleByNombre(nombreRol);
        const empresa = await this.empresasService.findEmpresaById(createUsuarioDto.idEmpresa);
        const saltRounds = 10;
        const hashedContrasena = await bcrypt.hash(createUsuarioDto.contrasena, saltRounds);        
        const usuario = this.usuarioRepository.create({
            ...createUsuarioDto,
            contrasena: hashedContrasena,
            rol,
            empresa
        });
        const usuarioGuardado = await this.usuarioRepository.save(usuario);
        return new UsuarioResponseDto(usuarioGuardado); 
    }

    async findUsuarioByCorreo(correo: string): Promise<Usuario | null>{
        const usuario= await this.usuarioRepository.findOne({ 
            where: { correo },
            relations: ['empresa', 'parqueadero']
        });
        return usuario;
    }

    async findUsuarioById(id: number): Promise<Usuario>{
        const usuario = await this.usuarioRepository.findOneBy({ id });
        if (!usuario) {
            throw new NotFoundException(`No existe usuario con id: ${id}`);
        }
        return usuario;
    }

    async eliminar(id: number): Promise<void>{
        const usuario = await this.findUsuarioById(id);
        this.usuarioValidator.validarEsOperador(usuario);
        //Aqui Validar operador trabaje en parqueadero de su empresa
        await this.usuarioRepository.remove(usuario);
    }
}
