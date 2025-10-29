import { RoleEnum } from "../enums/role-enum.enum";

export interface UsuarioResponseDto {
  id: number;
  nombre: string;
  correo: string;
  rol: RoleEnum;
  idEmpresa: number | null;
}