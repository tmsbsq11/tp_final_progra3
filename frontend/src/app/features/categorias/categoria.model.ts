export interface Categoria {
    id: number;
    nombre: string;
    isActive: boolean;
    needsCertification: boolean;
  }
  export type CategoriaFormulario = Omit<Categoria, 'id'>;