import { Component, Input } from '@angular/core';
import { EmpresaResponseDto } from '../../models/empresas/empresa-response.dto';
import { UsuarioSessionDto } from '../../models/usuarios/usuario-session.dto';

@Component({
  selector: 'app-empresa-info',
  imports: [],
  templateUrl: './empresa-info.html',
  styleUrl: './empresa-info.scss',
})
export class EmpresaInfoComponent {
  @Input() empresa?: EmpresaResponseDto;
  @Input() administrador? : UsuarioSessionDto | null;
}
