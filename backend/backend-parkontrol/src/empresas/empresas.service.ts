import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { Repository } from 'typeorm';
import { CrearEmpresaDto } from './entities/dto/crear-empresa.dto';
import { EmpresaResponseDto } from './entities/dto/empresa-response.dto';
import { EmpresaValidator } from './validators/empresa.validator';

@Injectable()
export class EmpresasService {

    constructor(
        @InjectRepository(Empresa)
        private readonly empresaRepository: Repository<Empresa>,
        private readonly empresaValidator: EmpresaValidator,
    ){}

    async crear(CrearEmpresaDto: CrearEmpresaDto): Promise<EmpresaResponseDto>{
        await this.empresaValidator.validarNitUnico(CrearEmpresaDto.nit);
        const empresa = this.empresaRepository.create(CrearEmpresaDto);
        const empresaSaved = await this.empresaRepository.save(empresa);
        return new EmpresaResponseDto(empresaSaved);
    }

    async findEmpresaById(id: number): Promise<Empresa>{
        const empresa = await this.empresaRepository.findOneBy({ id });
        if (!empresa) {
            throw new NotFoundException(`Empresa con id: ${id} no existe`);
        }
        return empresa;
    }
}
