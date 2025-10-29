import { Component, Input } from '@angular/core';
import { EmpresaResponseDto } from '../../models/empresas/empresa-response.dto';
import { UsuarioResponseDto } from '../../models/usuarios/usuario-response.dto';

@Component({
  selector: 'app-empresa-info',
  imports: [],
  templateUrl: './empresa-info.html',
  styleUrl: './empresa-info.scss',
})
export class EmpresaInfoComponent {
  @Input() empresa?: EmpresaResponseDto;
  @Input() administrador? : UsuarioResponseDto | null;
}
