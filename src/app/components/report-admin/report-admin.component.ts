import { Component, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartOptions } from 'chart.js';
import { ReportAdminService } from '../../services/report-admin.service';
import { CategoriaMasVendidaDTO } from '../../dto/CategoriaMasVendido.dto';
import { PlatoMasVendidoDTO } from '../../dto/PlatoMasVendido.dto';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-report-admin',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './report-admin.html',
  styleUrls: ['./report-admin.css']
})
export class ReportAdminComponent implements OnInit {

  categorias: CategoriaMasVendidaDTO[] = [];
  categoriaSeleccionada: string | null = null;

  categoriasChart: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Categorías más vendidas',
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  platosChart: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Platos más vendidos',
        data: [],
        backgroundColor: ['#4BC0C0', '#9966FF', '#FF9F40']
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Reporte de Ventas por Categoría' }
    }
  };

  constructor(private reportService: ReportAdminService) {}

  ngOnInit(): void {
    this.cargarDatosCategorias();
  }

  cargarDatosCategorias() {
    this.reportService.obtenerCategoriasMasVendidas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.categoriasChart.labels = categorias.map(c => c.nombreCategoria);
        this.categoriasChart.datasets[0].data = categorias.map(c => c.totalVendidos);
      },
      error: (err) => console.error('Error al cargar reporte:', err)
    });
  }

  onChartClick(event?: ChartEvent, active?: any[]): void {
    if (!event || !active?.length) return;

    const index = active[0].index;
    const categoria = this.categorias[index];

    if (categoria) {
      this.categoriaSeleccionada = categoria.nombreCategoria;
      this.cargarPlatosPorCategoria(categoria.idCategoria);
    }
  }

  cargarPlatosPorCategoria(categoriaId: number) {
    this.reportService.obtenerPlatosPorCategoria(categoriaId).subscribe({
      next: (platos: PlatoMasVendidoDTO[]) => {
        this.platosChart.labels = platos.map(p => p.nombrePlato);
        this.platosChart.datasets[0].data = platos.map(p => p.totalVendidos);
      },
      error: (err) => console.error('Error al cargar platos:', err)
    });
  }
}
