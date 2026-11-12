import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Categoria, CategoriaFormulario } from './categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/categorias';

  listar() { return this.http.get<Categoria[]>(this.url); }
  crear(categoria: CategoriaFormulario) { return this.http.post<Categoria>(this.url, categoria); }
}