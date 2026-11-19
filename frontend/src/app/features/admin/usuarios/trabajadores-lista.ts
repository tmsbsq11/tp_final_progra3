import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { mensajeDeError } from './errores';
import { FiltroEstado, compararPorNombre, normalizar, pasaFiltroEstado } from './filtros';
import { TrabajadorAdmin } from './usuario.model';
import { UsuariosAdminService } from './usuarios-admin.service';

@Component({
  selector: 'app-trabajadores-lista',
  imports: [DatePipe, RouterLink],
  templateUrl: './trabajadores-lista.html',
  styleUrl: '../admin.css',
})
export class TrabajadoresLista implements OnInit {
  private readonly servicio = inject(UsuariosAdminService);

  trabajadores = signal<TrabajadorAdmin[]>([]);
  texto = signal('');
  estado = signal<FiltroEstado>('TODOS');
  cargando = signal(true);
  mensaje = signal(''); // error al cargar la lista
  aviso = signal<string>(history.state?.aviso ?? ''); // resultado de una operación (llega del formulario)

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
        error: (e) => this.mensaje.set(mensajeDeError(e, 'No se pudo cargar el listado de trabajadores.')),
      });
  }

  // baja lógica o reactivación según el estado actual
  cambiarActivo(trabajador: TrabajadorAdmin): void {
    const activo = trabajador.isActive === true;
    const nombre = `${trabajador.nombre ?? ''} ${trabajador.apellido ?? ''}`.trim() || trabajador.correo;
    if (activo && !confirm(`¿Dar de baja la cuenta de ${nombre}?`)) return;

    this.aviso.set('');
    const peticion = activo
      ? this.servicio.desactivarTrabajador(trabajador.id)
      : this.servicio.reactivarTrabajador(trabajador.id);

    peticion.subscribe({
      next: () => {
        this.aviso.set(activo ? 'Cuenta dada de baja.' : 'Cuenta reactivada.');
        this.cargar(); // vuelve a pedir la lista: muestra el estado real del servidor
      },
      error: (e) => this.aviso.set(mensajeDeError(e, 'No se pudo cambiar el estado de la cuenta.')),
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
}
