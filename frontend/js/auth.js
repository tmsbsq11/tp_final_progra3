import { request, adminRequest } from './api.js';

const SESSION_KEYS = ['token', 'rol', 'userId', 'email', 'nombre'];

export function getToken() {
  return sessionStorage.getItem('token');
}

export function getSession() {
  return {
    token: sessionStorage.getItem('token'),
    rol: sessionStorage.getItem('rol'),
    userId: Number(sessionStorage.getItem('userId')) || null,
    email: sessionStorage.getItem('email'),
    nombre: sessionStorage.getItem('nombre'),
  };
}

export function isLoggedIn() {
  return !!getToken();
}

function saveSession({ token, rol, userId, email, nombre }) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('rol', rol);
  sessionStorage.setItem('userId', String(userId));
  sessionStorage.setItem('email', email);
  sessionStorage.setItem('nombre', nombre || email);
}

export function logout() {
  SESSION_KEYS.forEach((k) => sessionStorage.removeItem(k));
}

export async function login(correo, password) {
  const token = await request('/auth/login', {
    method: 'POST',
    body: { correo, password },
    auth: false,
  });

  sessionStorage.setItem('token', token);
  const profile = await detectRole(correo);
  saveSession({ token, ...profile });
  return profile;
}

export async function register({ nombre, correo, password, rol }) {
  await request('/auth/register', {
    method: 'POST',
    body: { nombre, correo, password, rol },
    auth: false,
  });
}

async function detectRole(correo) {
  try {
    const cliente = await request('/clientes/perfil', { silent: true });
    if (cliente?.rol === 'CLIENTE' || cliente?.id) {
      return {
        rol: 'CLIENTE',
        userId: cliente.id,
        email: cliente.correo || correo,
        nombre: cliente.nombre,
      };
    }
  } catch { /* siguiente */ }

  try {
    const trabajador = await request('/trabajadores/perfil', { silent: true });
    if (trabajador?.rol === 'TRABAJADOR' || trabajador?.id) {
      return {
        rol: 'TRABAJADOR',
        userId: trabajador.id,
        email: trabajador.correo || correo,
        nombre: trabajador.nombre,
      };
    }
  } catch { /* siguiente */ }

  try {
    const admins = await adminRequest('', { silent: true });
    const list = Array.isArray(admins) ? admins : [];
    const admin = list.find((a) => a.correo === correo);
    if (admin) {
      return {
        rol: 'ADMIN',
        userId: admin.id,
        email: admin.correo || correo,
        nombre: admin.nombre,
      };
    }
  } catch { /* fallthrough */ }

  logout();
  throw new Error('No se pudo determinar el rol del usuario');
}

function emailFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.sub || null;
  } catch {
    return null;
  }
}

export async function restoreSession() {
  if (!getToken()) return null;
  const email = sessionStorage.getItem('email') || emailFromToken(getToken());
  if (email && sessionStorage.getItem('rol')) {
    return getSession();
  }
  try {
    const profile = await detectRole(email || '');
    saveSession({ token: getToken(), ...profile });
    return getSession();
  } catch {
    logout();
    return null;
  }
}
