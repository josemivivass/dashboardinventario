import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InventarioService } from '../../services/inventario.service';
import { ItemModalComponent } from '../item-modal/item-modal.component';
import { Suministro } from '../../models/suministro.model';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemModalComponent],
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.css']
})
export class InventoryTableComponent {
  inventarioService = inject(InventarioService);
  
  searchTerm = signal('');
  minStock = signal(0);
  
  suministrosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const min = this.minStock();
    return this.inventarioService.suministros().filter(s => 
      (s.nombre.toLowerCase().includes(term) || s.categoria.toLowerCase().includes(term)) &&
      s.stock >= min
    );
  });

  isModalOpen = false;
  itemToEdit: Suministro | null = null;

  abrirModalNuevo() {
    this.itemToEdit = null;
    this.isModalOpen = true;
  }

  abrirModalEditar(item: Suministro) {
    this.itemToEdit = { ...item };
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  eliminarItem(id: string) {
    if (confirm('¿Autoriza la eliminación de este registro de la base de datos ANBU?')) {
      this.inventarioService.eliminar(id);
    }
  }

  exportarInventario(formato: 'excel' | 'pdf') {
    const data = this.suministrosFiltrados();

    if (formato === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Suministros');
      XLSX.writeFile(workbook, 'Reporte_ANBU.xlsx');
    } else {
      const doc = new jsPDF();
      doc.text('MANIFIESTO DE SUMINISTROS ANBU', 14, 20);
      autoTable(doc, {
        startY: 30,
        head: [['ID', 'Nombre', 'Categoría', 'Stock', 'Precio', 'Rango']],
        body: data.map(s => [s.id, s.nombre, s.categoria, s.stock.toString(), `${s.precioUnitario}¥`, s.rangoRequerido]),
      });
      doc.save('Manifiesto_Mision.pdf');
    }
  }
}