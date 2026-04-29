import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  inventarioService = inject(InventarioService);
  stats = this.inventarioService.getStats();

  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  radarChartData: ChartData<'radar'> = { labels: [], datasets: [] };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f5f5f5' } }
    },
    scales: {
      x: { 
        ticks: { color: '#f5f5f5' }, 
        grid: { color: '#333' } 
      },
      y: { 
        ticks: { color: '#f5f5f5' }, 
        grid: { color: '#333' },
        beginAtZero: true
      }
    }
  };

  radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f5f5f5' } }
    },
    scales: {
      r: {
        angleLines: { color: '#333' },
        grid: { color: '#333' },
        pointLabels: { 
          color: '#f5f5f5',
          font: { size: 12 }
        },
        ticks: {
          display: false,
          backdropColor: 'transparent'
        }
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f5f5f5' } }
    }
  };

  constructor() {
    effect(() => {
      this.actualizarDatos();
    });
  }

  actualizarDatos() {
    this.stats = this.inventarioService.getStats();
    const chartInfo = this.inventarioService.getChartData();

    this.barChartData = {
      labels: chartInfo.categorias,
      datasets: [{ 
        data: chartInfo.stockPorCategoria, 
        label: 'Unidades en Stock', 
        backgroundColor: '#cc0000'
      }]
    };

    this.pieChartData = {
      labels: chartInfo.categorias,
      datasets: [{ 
        data: chartInfo.stockPorCategoria, 
        backgroundColor: ['#cc0000', '#8b0000', '#ff4d4d', '#4d0000']
      }]
    };

    this.radarChartData = {
      labels: chartInfo.categorias,
      datasets: [{ 
        data: chartInfo.stockPorCategoria, 
        label: 'Balance de Arsenal', 
        borderColor: '#cc0000', 
        backgroundColor: 'rgba(204, 0, 0, 0.4)',
        fill: true,
        pointBackgroundColor: '#cc0000'
      }]
    };
  }
}