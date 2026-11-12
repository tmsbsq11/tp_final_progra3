import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login implements OnInit {

  formulario!: FormGroup;
  mensaje = signal('');
  enviando = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ingresar(): void {
    
    if (this.formulario.invalid || this.enviando()) {
      return;
    }

    const { correo, password } = this.formulario.getRawValue();

    this.mensaje.set('');
    this.enviando.set(true);

    this.authService.login(correo, password)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: (token) => {
          sessionStorage.setItem('oficiosya_token', token);
          this.mensaje.set('Sesión iniciada.');
        },
        error: ({ status }) => {
          if (status === 401) {
            this.mensaje.set('Revisá tu correo y contraseña.');
          }else if(status === 403){ 
            this.mensaje.set('No tenés permisos para acceder a esta aplicación.');
          }else {
            this.mensaje.set('No se pudo iniciar sesión. Revisá si Spring está corriendo.');
          }
        },
      });
  }
}