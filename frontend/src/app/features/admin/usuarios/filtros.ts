import { UsuarioAdmin } from './usuario.model';

export type FiltroEstado = 'TODOS' | 'ACTIVOS' | 'INACTIVOS';

//ignora mayusculas y acentos al buscar
export function normalizar(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// null cuenta como inactivo (como isEnabled() en el backend)
export function pasaFiltroEstado(isActive: boolean | null, estado: FiltroEstado): boolean {
  if (estado === 'TODOS') return true;
  return estado === 'ACTIVOS' ? isActive === true : isActive !== true;
}

// Ordena por apellido y nombre (con reglas del español)
export function compararPorNombre(a: UsuarioAdmin, b: UsuarioAdmin): number {
  const nombre = (u: UsuarioAdmin) => `${u.apellido ?? ''} ${u.nombre ?? ''}`.trim();
  return nombre(a).localeCompare(nombre(b), 'es');
}
