import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum RoleEnum {
    ADMIN = 'ADMIN',
    OPERADOR = 'OPERADOR',
}

@Entity('ROL')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'ID_ROL' })
  id: number;

  @Column({ name: 'NOMBRE',  unique: true })
  nombre: RoleEnum;
}
