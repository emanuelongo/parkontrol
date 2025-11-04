import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacturacionService } from '../../services/facturacion.service';
import { AuthService } from '../../services/autenticacion.service';
import { FacturaElectronica } from '../../models/facturacion.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-facturas-lista',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, CommonModule],
  templateUrl: './facturas-lista.component.html',
  styleUrls: ['./facturas-lista.component.scss']
})
export class FacturasListaComponent {
  @Input() facturas: FacturaElectronica[] = [];
  displayedColumns = ['id', 'idPago', 'idClienteFactura', 'cufe', 'enviada', 'fechaEmision'];

  abrirModalNuevaFactura(): void {
    // Aqui se abriria para crear nueva factura
  }
}
