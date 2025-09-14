import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, JsonPipe, NgIf } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, JsonPipe, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ocupacion: any[] | null = null;
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getCeldas().subscribe({
      next: (res: any) => { this.ocupacion = Array.isArray(res) ? res : res.records || res; this.loading = false; },
      error: (err) => { this.error = 'No se pudo cargar ocupación'; this.loading = false; }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
