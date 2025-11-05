import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol, RoleEnum } from 'src/shared/entities/rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>,
    ){}

    async findRoleByNombre(nombre: RoleEnum): Promise<Rol> {
        // Buscar primero por ID esperado para roles conocidos
        const expectedId = nombre === RoleEnum.ADMIN ? 1 : nombre === RoleEnum.OPERADOR ? 2 : undefined;
        
        if (expectedId) {
            let rol = await this.rolRepository.findOneBy({ id: expectedId });
            if (rol) {
                return rol;
            }
            // Si no existe con el ID esperado, crearlo
            rol = this.rolRepository.create({ id: expectedId, nombre });
            return await this.rolRepository.save(rol);
        }
        
        // Para roles no conocidos, buscar por nombre
        let rol = await this.rolRepository.findOneBy({ nombre });
        if (!rol) {
            rol = this.rolRepository.create({ nombre });
            rol = await this.rolRepository.save(rol);
        }
        return rol;
    }
}
