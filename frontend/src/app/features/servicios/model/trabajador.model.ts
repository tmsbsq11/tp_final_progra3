export interface Trabajador {
  id: number;
  nombre: string;
  apellido: string | null;
  descripcion?: string | null;
  puntaje?: number | null;
  minutosMinimoEntreReservas?: number | null;
}