// convierte un error http en un texto para mostrar. Es para no perder los mensajes especificos del backend
export function mensajeDeError(e: { status: number; error: unknown }, porDefecto: string): string {
  if (e.status === 401 || e.status === 403) return 'Necesitás una sesión de administrador.';
  if (e.status === 0) return 'No se pudo conectar con el servidor.';

  let cuerpo: unknown = e.error;
  if (typeof cuerpo === 'string' && cuerpo) {
    try {
      cuerpo = JSON.parse(cuerpo);
    } catch {
      return cuerpo as string; // texto plano
    }
  }
  const mensaje = (cuerpo as { message?: string } | null)?.message;
  if (mensaje) return mensaje;
  if (e.status === 404) return 'La cuenta no existe.';
  return porDefecto;
}
