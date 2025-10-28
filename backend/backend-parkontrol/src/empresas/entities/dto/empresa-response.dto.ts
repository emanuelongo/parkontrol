import { Empresa } from "../empresa.entity";

export class EmpresaResponseDto{
    id: number;
    nit: string;
    nombre: string;

    constructor(empresa: Empresa){
        this.id= empresa.id;
        this.nit= empresa.nit;
        this.nombre= empresa.nombre
    }

}