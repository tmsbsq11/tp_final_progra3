import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FiltroEstado, compararPorNombre, normalizar, pasaFiltroEstado } from './filtros';
import { ClienteAdmin } from './usuario.model';
import { UsuariosAdminService } from './usuarios-admin.service';

@Component({
  selector: 'app-clientes-lista',
  imports: [DatePipe],
  templateUrl: './clientes-lista.html',
})
export class ClientesLista implements OnInit {
  private readonly servicio = inject(UsuariosAdminService);

  clientes = signal<ClienteAdmin[]>([]);
  texto = signal('');
  estado = signal<FiltroEstado>('TODOS');
  cargando = signal(true);
  mensaje = signal('');

  // para que se recalcule con los filtros
  visibles = computed(() => {
    const busqueda = normalizar(this.texto());
    const estado = this.estado();

    return this.clientes()
      .filter((c) => {
        if (!pasaFiltroEstado(c.isActive, estado)) return false;
        if (!busqueda) return true;
        const datos = `${c.nombre ?? ''} ${c.apellido ?? ''} ${c.correo ?? ''} ${c.dni ?? ''}`;
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
      .listarClientes()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.clientes.set(lista),
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
    return 'No se pudo cargar el listado de clientes.';
  }
}
