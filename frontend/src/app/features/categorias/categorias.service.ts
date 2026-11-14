import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Categoria, CategoriaFormulario } from './categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/categorias';

  listar() { 
    return this.http.get<Categoria[]>(this.url);
  }

  crear(categoria: CategoriaFormulario) {
    return this.http.post<Categoria>(this.url, categoria);
  }

  actualizar(id: number, categoria: CategoriaFormulario) {
    return this.http.put<Categoria>(`${this.url}/${id}`, categoria);
  }
  
  reactivar(id: number) {
    return this.http.put<Categoria>(`${this.url}/reactivar/${id}`, null);
  }
  
  // El backend responde texto plano, por eso responseType: 'text'
  desactivar(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

}