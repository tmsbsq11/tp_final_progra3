import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FiltroEstado, compararPorNombre, normalizar, pasaFiltroEstado } from '../filtros';
import { TrabajadorAdmin } from '../usuario.model';
import { UsuariosAdminService } from '../usuarios-admin.service';

@Component({
  selector: 'app-trabajadores-lista',
  imports: [DatePipe],
  templateUrl: './trabajadores-lista.html',
})
export class TrabajadoresLista implements OnInit {
  private readonly servicio = inject(UsuariosAdminService);

  trabajadores = signal<TrabajadorAdmin[]>([]);
  texto = signal('');
  estado = signal<FiltroEstado>('TODOS');
  cargando = signal(true);
  mensaje = signal('');

// para que se recalcule con los filtros
  visibles = computed(() => {
    const busqueda = normalizar(this.texto());
    const estado = this.estado();

    return this.trabajadores()
      .filter((t) => {
        if (!pasaFiltroEstado(t.isActive, estado)) return false;
        if (!busqueda) return true;
        const datos = `${t.nombre ?? ''} ${t.apellido ?? ''} ${t.correo ?? ''} ${t.dni ?? ''}`;
        return normalizar(datos).includes(busqueda);
      })
      .sort(compararPorNombre);
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.mensaje.set('');
    this.servicio
      .listarTrabajadores()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.trabajadores.set(lista),
        error: (e) => this.mensaje.set(this.textoError(e)),
      });
  }

  cambiarTexto(evento: Event): void {
    this.texto.set((evento.target as HTMLInputElement).value);
  }

  cambiarEstado(evento: Event): void {
    this.estado.set((evento.target as HTMLSelectElement).value as FiltroEstado);
  }

  limpiarFiltros(): void {
    this.texto.set('');
    this.estado.set('TODOS');
  }

  private textoError(e: { status: number }): string {
    if (e.status === 401 || e.status === 403) return 'Necesitás una sesión de administrador.';
    if (e.status === 0) return 'No se pudo conectar con el servidor.';
    return 'No se pudo cargar el listado de trabajadores.';
  }
}
