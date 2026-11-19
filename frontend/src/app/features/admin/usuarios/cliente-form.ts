import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { mensajeDeError } from './errores';
import { UsuariosAdminService } from './usuarios-admin.service';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.html',
})
export class ClienteForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(UsuariosAdminService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  // si la URL trae :id estamos editando. si no creando
  readonly id = this.ruta.snapshot.paramMap.get('id');
  readonly editando = this.id !== null;

  formulario = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    password: ['', Validators.minLength(8)],
    descripcion: [''],
  });
  cargando = signal(false);
  enviando = signal(false);
  mensaje = signal('');

  ngOnInit(): void {
    if (!this.editando) {
      // al crear la contraseña es obligatoria. al editar se deja vacía para no cambiarla
      const password = this.formulario.controls.password;
      password.addValidators(Validators.required);
      password.updateValueAndValidity();
      return;
    }

    this.cargando.set(true);
    this.servicio
      .obtenerCliente(Number(this.id))
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (c) =>
          this.formulario.patchValue({
            nombre: c.nombre ?? '',
            apellido: c.apellido ?? '',
            correo: c.correo,
            dni: c.dni ?? '',
            descripcion: c.descripcion ?? '',
          }),
        error: (e) => this.mensaje.set(mensajeDeError(e, 'No se pudo cargar el cliente.')),
      });
  }

  guardar(): void {
    if (this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.mensaje.set('');
    this.enviando.set(true);

    // la contraseña vacía (solo cuando editamos) no se envía. username = correo (el backend lo pide)
    const { password, ...resto } = this.formulario.getRawValue();
    const datos = { ...resto, username: resto.correo, ...(password ? { password } : {}) };

    const peticion = this.editando
      ? this.servicio.actualizarCliente(Number(this.id), datos)
      : this.servicio.crearCliente(datos);

    peticion.pipe(finalize(() => this.enviando.set(false))).subscribe({
      next: () =>
        this.router.navigate(['/admin/clientes'], {
          state: { aviso: this.editando ? 'Cliente actualizado.' : 'Cliente creado.' },
        }),
      error: (e) =>
        this.mensaje.set(
          mensajeDeError(e, 'No se pudo guardar. Revisá los datos (correo y DNI no pueden estar repetidos).'),
        ),
    });
  }
}
