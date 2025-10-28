import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpresasService {

    constructor(
        @InjectRepository(Empresa)
        private readonly empresaRepository: Repository<Empresa>,
    ){}

    async findEmpresaById(id: number): Promise<Empresa>{
        const empresa = await this.empresaRepository.findOneBy({ id });
        if (!empresa) {
            throw new NotFoundException(`Empresa con id: ${id} no existe`);
        }
        return empresa;
    }
}
