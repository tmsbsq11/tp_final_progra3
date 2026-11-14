import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Categoria } from '../categoria.model';
import { CategoriasService } from '../categorias.service';

@Component({
  selector: 'app-categorias-lista',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categorias-lista.html',
})
export class CategoriasLista implements OnInit {
  private fb = inject(FormBuilder);
  private categoriasService = inject(CategoriasService);

  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  mensaje = signal('');
  editando = signal<Categoria | null>(null);

  formulario = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    needsCertification: [false],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.categoriasService
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.categorias.set(lista),
        error: (e) => this.mensaje.set(this.textoError(e, 'No se pudieron cargar las categorías.')),
      });
  }

  editar(categoria: Categoria): void {
    this.mensaje.set('');
    this.editando.set(categoria);
    this.formulario.setValue({
      nombre: categoria.nombre,
      needsCertification: categoria.needsCertification,
    });
  }

  cancelar(): void {
    this.editando.set(null);
  }

  guardar(): void {
    const categoria = this.editando();
    if (!categoria || this.formulario.invalid || this.guardando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { nombre, needsCertification } = this.formulario.getRawValue();
    this.guardando.set(true);

    this.categoriasService
      .actualizar(categoria.id, { nombre, needsCertification, isActive: categoria.isActive })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          this.mensaje.set(`Categoría "${nombre}" actualizada.`);
          this.editando.set(null);
          this.cargar();
        },
        error: (e) => this.mensaje.set(this.textoError(e, 'No se pudo actualizar la categoría.')),
      });
  }

  cambiarEstado(categoria: Categoria): void {
    if (categoria.isActive && !confirm(`¿Desactivar la categoría "${categoria.nombre}"?`)) {
      return;
    }
    this.mensaje.set('');

    const observador = {
      next: () => {
        this.mensaje.set(
          categoria.isActive
            ? `Categoría "${categoria.nombre}" desactivada.`
            : `Categoría "${categoria.nombre}" reactivada.`
        );
        this.cargar();
      },
      error: (e: { status: number; error: unknown }) =>
        this.mensaje.set(this.textoError(e, 'No se pudo cambiar el estado.')),
    };

    if (categoria.isActive) {
      this.categoriasService.desactivar(categoria.id).subscribe(observador);
    } else {
      this.categoriasService.reactivar(categoria.id).subscribe(observador);
    }
  }

  // El backend puede responder texto plano o { message, path }
  private textoError(e: { status: number; error: unknown }, porDefecto: string): string {
    if (e.status === 401 || e.status === 403) {
      return 'Necesitás una sesión de administrador.';
    }
    if (typeof e.error === 'string' && e.error) {
      return e.error;
    }
    return (e.error as { message?: string } | null)?.message ?? porDefecto;
  }
}