import { Component, OnInit } from '@angular/core';
import { FacturacionService } from '../../services/facturacion.service';
import { AuthService } from '../../services/autenticacion.service';
import { ClienteFactura, FacturaElectronica } from '../../models/facturacion.model';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientesFacturaComponent } from '../../components/clientes-factura/clientes-factura.component';
import { FacturasListaComponent } from '../../components/facturas-lista/facturas-lista.component';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [
    MatTabsModule,
    ClientesFacturaComponent,
    FacturasListaComponent
  ],
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})

export class FacturacionComponent implements OnInit {

  clientesFactura: ClienteFactura[] = [];
  facturas: FacturaElectronica[] = [];
  idEmpresa: number | null = null;
  loading = false;

  constructor(
    private facturacionService: FacturacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const usuario = this.authService.getUsuarioActual();
    this.idEmpresa = usuario?.idEmpresa || null;

    if (this.idEmpresa) {
      
      this.loading = true;
      let peticionesCompletadas = 0;
      const totalPeticiones = 2;

      this.facturacionService.getClientesFactura(this.idEmpresa).subscribe({
        next: (data) => { this.clientesFactura = data; },
        error: () => { this.clientesFactura = []; },
        complete: () => {
          peticionesCompletadas++;
          if (peticionesCompletadas === totalPeticiones) this.loading = false;
        }
      });

      this.facturacionService.getFacturas(this.idEmpresa).subscribe({
        next: (data) => { this.facturas = data; },
        error: () => { this.facturas = []; },
        complete: () => {
          peticionesCompletadas++;
          if (peticionesCompletadas === totalPeticiones) this.loading = false;
        }
      });
    }
  }
}