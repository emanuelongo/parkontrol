import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Empresa } from "../entities/empresa.entity";
import { Repository } from "typeorm";

@Injectable()
export class EmpresaValidator{

    constructor(
        @InjectRepository(Empresa)
        private readonly empresaRepository: Repository<Empresa>,
    ){}

    async validarNitUnico(nit: string): Promise<void>{
        const empresaExiste = await this.empresaRepository.findOneBy({ nit });
        if(empresaExiste){
            throw new BadRequestException(`Ya existe una empresa registrada con el NIT ${nit}.`);
        } 
    }
}