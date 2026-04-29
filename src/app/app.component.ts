import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryTableComponent } from './components/inventory-table/inventory-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, InventoryTableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Central de Inteligencia ANBU';
}