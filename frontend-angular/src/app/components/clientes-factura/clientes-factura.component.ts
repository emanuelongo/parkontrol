import { Component, Input } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { AuthService } from '../../services/autenticacion.service';
import { ClienteFactura } from '../../models/facturacion.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clientes-factura',
  standalone: true,
  imports: [ MatTableModule, MatButtonModule],
  templateUrl: './clientes-factura.component.html',
  styleUrls: ['./clientes-factura.component.scss']
})
export class ClientesFacturaComponent {
  @Input() clientes: ClienteFactura[] = [];
  displayedColumns = ['id', 'tipoDocumento', 'numeroDocumento', 'correo'];

  abrirModalNuevoCliente(): void {
    // Aquí se abriria el modal para crear cliente de factura
  }
}
