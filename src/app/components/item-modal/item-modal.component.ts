import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Suministro } from '../../models/suministro.model';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent {
  @Input() item: Suministro | null = null;
  @Output() close = new EventEmitter<void>();
  
  inventarioService = inject(InventarioService);
  
  formData: Partial<Suministro> = {};

  ngOnInit() {
    if (this.item) {
      this.formData = { ...this.item };
    } else {
      this.formData = {
        id: 'S' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        nombre: '',
        categoria: 'Armamento',
        stock: 0,
        precioUnitario: 0,
        rangoRequerido: 'Genin',
        ultimaActualizacion: new Date().toISOString().split('T')[0]
      };
    }
  }

  guardar() {
    if (this.item) {
      this.inventarioService.actualizar(this.formData as Suministro);
    } else {
      this.inventarioService.agregar(this.formData as Suministro);
    }
    this.close.emit();
  }
}