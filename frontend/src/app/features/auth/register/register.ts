import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";

type RolRegistro = "CLIENTE" | "TRABAJADOR";

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: "app-register",
  styleUrl: "./register.css",
  templateUrl: "./register.html",
})
export class Register implements OnInit {
  formulario!: FormGroup;
  rolSeleccionado = signal<RolRegistro | null>(null);
  mensaje = signal("");
  enviando = signal(false);

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ["", Validators.required],
      correo: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rol: ["", Validators.required],
    });
  }

  seleccionarRol(rol: RolRegistro): void {
    this.mensaje.set("");
    this.formulario.patchValue({ rol });
    this.rolSeleccionado.set(rol);
  }

  cambiarTipo(): void {
    if (this.enviando()) return;
    this.formulario.reset({ nombre: "", correo: "", password: "", rol: "" });
    this.mensaje.set("");
    this.rolSeleccionado.set(null);
  }

  registrar(): void {
    if (this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { correo, password, rol, nombre } = this.formulario.getRawValue();
    this.mensaje.set("");
    this.enviando.set(true);
    this.authService
      .register(correo, password, rol, nombre)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(["/login"]);
        },
        error: ({ status }) => {
          this.mensaje.set(
            status === 409
              ? "El correo ya está registrado. Iniciá sesión."
              : "No se pudo crear la cuenta. Revisá los datos e intentá nuevamente.",
          );
        },
      });
  }
}
