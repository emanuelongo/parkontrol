import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolesService } from './services/roles/roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Rol]),
    ],
    providers: [RolesService],
    exports: [TypeOrmModule, RolesService],
})
export class SharedModule {}
