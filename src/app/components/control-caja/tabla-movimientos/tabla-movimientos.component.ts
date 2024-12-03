import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientoCaja } from '../../../models/movimiento-caja';
import { CajaService } from '../../../services/caja.service';

@Component({
  selector: 'app-tabla-movimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-movimientos.component.html',
  styleUrls: ['./tabla-movimientos.component.css']
})
export class TablaMovimientosComponent implements OnInit {
  movimientos: MovimientoCaja[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  pages: number[] = [];

  constructor(private cajaService: CajaService) {}

  ngOnInit() {
    this.cargarMovimientos();
  }

  cargarMovimientos() {
    this.cajaService.getAllMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.calculatePages();
      },
      error: (error) => console.error('Error al cargar movimientos:', error)
    });
  }

  get paginatedMovimientos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.movimientos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  calculatePages() {
    const pageCount = Math.ceil(this.movimientos.length / this.itemsPerPage);
    this.pages = Array.from({length: pageCount}, (_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}