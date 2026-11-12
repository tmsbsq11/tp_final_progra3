import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CategoriasService } from '../categorias.service';

@Component({
  selector: 'app-categoria-form',
  imports: [ReactiveFormsModule],
  templateUrl: './categoria-form.html',
})
export class CategoriaForm {
  private fb = inject(FormBuilder);
  private categoriasService = inject(CategoriasService);

  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    isActive: [true],
    needsCertification: [false],
  });
  mensaje = signal('');
  enviando = signal(false);

  crear(): void {
    if (this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.mensaje.set('');
    this.enviando.set(true);

    this.categoriasService.crear(this.formulario.getRawValue())
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: (c) => {
          this.mensaje.set(`Categoría "${c.nombre}" creada.`);
          this.formulario.reset({ nombre: '', isActive: true, needsCertification: false });
        },
        error: ({ status, error }) => {
          if (status === 401 || status === 403) {
            this.mensaje.set('Necesitás una sesión de administrador.');
          } else {
            this.mensaje.set(error?.message ?? 'No se pudo crear la categoría.');
          }
        },
      });
  }
}