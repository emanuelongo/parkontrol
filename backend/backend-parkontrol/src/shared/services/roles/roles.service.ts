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
        const rol = await this.rolRepository.findOneBy({ nombre });
        if (!rol) {
            throw new NotFoundException(`Rol ${nombre} no encontrado`);
        }
        return rol;
    }
}
