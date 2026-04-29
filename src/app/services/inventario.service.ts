import { Injectable, signal } from '@angular/core';
import { Suministro, SUMINISTROS_MOCK } from '../models/suministro.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private suministrosSignal = signal<Suministro[]>(SUMINISTROS_MOCK);
  suministros = this.suministrosSignal.asReadonly();

  getStats() {
    const data = this.suministrosSignal();
    return {
      totalStock: data.reduce((acc, s) => acc + s.stock, 0),
      totalValor: data.reduce((acc, s) => acc + (s.stock * s.precioUnitario), 0),
      bajoStock: data.filter(s => s.stock < 10).length,
      categoriaPrincipal: this.getMostFrequent(data.map(s => s.categoria)) || 'N/A'
    };
  }

  getChartData() {
    const data = this.suministrosSignal();
    const categorias = ['Armamento', 'Médico', 'Sigilo', 'Herramientas'];
    const stockPorCategoria = categorias.map(cat => 
      data.filter(s => s.categoria === cat).reduce((acc, s) => acc + s.stock, 0)
    );
    return { categorias, stockPorCategoria };
  }

  agregar(suministro: Suministro) {
    this.suministrosSignal.update(s => [...s, suministro]);
  }

  actualizar(suministro: Suministro) {
    this.suministrosSignal.update(s => s.map(item => item.id === suministro.id ? suministro : item));
  }

  eliminar(id: string) {
    this.suministrosSignal.update(s => s.filter(item => item.id !== id));
  }

  private getMostFrequent(arr: string[]) {
    if (arr.length === 0) return null;
    const counts = arr.reduce((acc: any, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
}