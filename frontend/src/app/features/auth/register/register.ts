import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators ,ReactiveFormsModule} from '@angular/forms';
import { signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  formulario!: FormGroup;

  mensaje = signal('');
  enviando = signal(false);

  constructor(private fb: FormBuilder,private authService: AuthService) {
   }
  ngOnInit(): void {
  this.formulario = this.fb.group({
    correo:['',[Validators.required,Validators.email]],
    password:['',[Validators.required]],
  })
  }
 registrar():void{
  if(this.formulario.invalid || this.enviando()){
    this.formulario.markAllAsTouched();
    return;
  }
  const {correo,password}=this.formulario.getRawValue();

  this.mensaje.set('');
  this.enviando.set(true);

  this.authService.register(correo,password).pipe(finalize(()=>this.enviando.set(false))).subscribe({
    next: ()=>{
      this.mensaje.set('Usuario registrado correctamente. Inicie sesión.');
      this.formulario.reset();
    },
    error:({status})=>{
      if(status===409){
        this.mensaje.set('El correo ya está registrado. Inicie sesión.');
      }else if(status===400){
        this.mensaje.set('Los datos proporcionados no son válidos.');
      }else
      {
        this.mensaje.set('No se pudo registrar el usuario. Revisá si Spring está corriendo.');
      }
    },
  });
 }
}
