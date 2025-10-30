import { RoleEnum } from "../enums/role-enum.enum";

export interface UsuarioSessionDto {
  id: number;
  correo: string;
  nombreRol: RoleEnum;
  idEmpresa: number | null;
}