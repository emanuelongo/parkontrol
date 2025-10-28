import { IsNotEmpty, IsNumberString, IsString, Length, Matches, MinLength } from "class-validator";

export class CrearEmpresaDto{

    @IsNotEmpty()
    @IsNumberString()
    @Length(5,15)
    nit: string

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    nombre: string;
   
}