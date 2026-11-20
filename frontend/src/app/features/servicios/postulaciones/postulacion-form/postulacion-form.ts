import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ClienteServicios } from '../../client/cliente-servicios';
import { GuardarServicio } from '../../model/servicio.model';

@Component({
    selector: 'app-postulacion-form',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './postulacion-form.html',
    styleUrl: './postulacion-form.css',
})
export class PostulacionForm implements OnInit {
  formulario!: FormGroup;
  idPostulacion?: number;

  categorias = signal<{ id: number; nombre: string }[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  formularioDisponible = signal(false);
  mensaje = signal('');
  mensajeCategorias = signal('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteServicios: ClienteServicios,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      idCategoria: [null, Validators.required],
      minTiempo: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      precioEstimadoPorHora: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000),
      ]],
    });

    const idTrabajador = this.authService.getUserId();
    if (idTrabajador === null || this.authService.getUserRole()?.toLowerCase() !== 'trabajador') {
      this.mensaje.set('Iniciá sesión como trabajador para gestionar tus postulaciones.');
      return;
    }

    this.clienteServicios.obtenerCategorias().subscribe({
      next: categorias => {
        this.categorias.set(
          categorias.filter(c => c.isActive === true)
        );
      },
      error: () => {
        this.mensajeCategorias.set(
          'No se pudieron cargar las categorías.'
        );
      },
    });

    const idRuta = this.route.snapshot.paramMap.get('id');

    if (idRuta === null) {
      this.formularioDisponible.set(true);
      return;
    }

    const id = Number(idRuta);
    if (!Number.isInteger(id) || id <= 0) {
      this.mensaje.set('El ID de la postulación no es válido.');
      return;
    }

    this.idPostulacion = id;
    this.cargando.set(true);

    this.clienteServicios.obtenerServicioPorId(id)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: servicio => {
          if (servicio.trabajador.id !== idTrabajador) {
            this.mensaje.set('Solo podés editar tus propias postulaciones.');
            return;
          }

          this.formulario.patchValue({
            titulo: servicio.titulo,
            descripcion: servicio.descripcion,
            idCategoria: servicio.categoria.id,
            minTiempo: servicio.minTiempo,
            precioEstimadoPorHora: servicio.precioEstimadoPorHora,
          });
          this.formularioDisponible.set(true);
        },
        error: () => this.mensaje.set('No se pudo cargar la postulación.'),
      });
  }

  onSubmit(): void {
    if (!this.formularioDisponible() || this.guardando()) return;

    const idTrabajador = this.authService.getUserId();
    if (idTrabajador === null || this.authService.getUserRole()?.toLowerCase() !== 'trabajador') {
      this.mensaje.set('Volvé a iniciar sesión como trabajador.');
      return;
    }

    const { titulo, descripcion } = this.formulario.getRawValue();
    this.formulario.patchValue({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
    });

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos: GuardarServicio = {
      ...this.formulario.getRawValue(),
      idTrabajador,
    };

    const peticion = this.idPostulacion === undefined
      ? this.clienteServicios.agregarServicio(datos)
      : this.clienteServicios.modificarServicio(this.idPostulacion, datos);

    this.mensaje.set('');
    this.guardando.set(true);

    peticion.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => this.router.navigate(['/mis-postulaciones']),
      error: () => this.mensaje.set('No se pudo guardar la postulación.'),
    });
  }
}