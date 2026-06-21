import { NAV_BY_ROLE, DEFAULT_ROUTE } from './config.js';
import { isLoggedIn, getSession, logout } from './auth.js';
import { parsePerfilRoute } from './views/shared.js';

const ROUTE_MAP = {
  '#/login': 'view-login',
  '#/register': 'view-register',
  '#/servicios': 'view-servicios',
  '#/reservas': 'view-reservas',
  '#/perfil-cliente': 'view-perfil-cliente',
  '#/resenias': 'view-resenias',
  '#/notificaciones': 'view-notificaciones',
  '#/mis-servicios': 'view-mis-servicios',
  '#/reservas-recibidas': 'view-reservas-recibidas',
  '#/resenias-trabajador': 'view-resenias-trabajador',
  '#/perfil-trabajador': 'view-perfil-trabajador',
  '#/admin/categorias': 'view-admin-categorias',
  '#/admin/servicios': 'view-admin-servicios',
  '#/admin/certificacion': 'view-admin-certificacion',
  '#/admin/reservas': 'view-admin-reservas',
  '#/admin/notificaciones': 'view-admin-notificaciones',
  '#/admin/usuarios': 'view-admin-usuarios',
};

const PUBLIC_ROUTES = new Set(['#/login', '#/register']);

const SHARED_ROUTES = new Set(['#/notificaciones']);

const viewHandlers = new Map();
let currentParams = null;

export function onRoute(hash, handler) {
  viewHandlers.set(hash, handler);
}

export function onRoutePattern(prefix, handler) {
  viewHandlers.set(`pattern:${prefix}`, handler);
}

function resolveRoute(hash) {
  if (ROUTE_MAP[hash]) {
    return { hash, viewId: ROUTE_MAP[hash], params: null };
  }
  const perfil = parsePerfilRoute(hash);
  if (perfil) {
    return { hash, viewId: 'view-perfil-publico', params: perfil };
  }
  return null;
}

function allowedForRole(hash, rol) {
  if (PUBLIC_ROUTES.has(hash)) return true;
  if (SHARED_ROUTES.has(hash)) {
    return ['CLIENTE', 'TRABAJADOR'].includes(rol);
  }
  if (parsePerfilRoute(hash)) {
    return ['CLIENTE', 'TRABAJADOR', 'ADMIN'].includes(rol);
  }
  const nav = NAV_BY_ROLE[rol] || [];
  return nav.some((item) => item.hash === hash);
}

function renderNav() {
  const nav = document.getElementById('main-nav');
  const session = getSession();
  nav.innerHTML = '';

  if (!session.rol) return;

  (NAV_BY_ROLE[session.rol] || []).forEach((item) => {
    const a = document.createElement('a');
    a.href = item.hash;
    a.textContent = item.label;
    if (location.hash === item.hash || (!location.hash && item.hash === DEFAULT_ROUTE[session.rol])) {
      a.classList.add('active');
    }
    nav.appendChild(a);
  });
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach((el) => el.classList.add('hidden'));
  const view = document.getElementById(viewId);
  if (view) view.classList.remove('hidden');
}

export async function navigate() {
  let hash = location.hash || '#/';
  if (hash === '#/') {
    if (isLoggedIn()) {
      const { rol } = getSession();
      hash = DEFAULT_ROUTE[rol] || '#/login';
      location.hash = hash;
      return;
    }
    hash = '#/login';
    location.hash = hash;
    return;
  }

  const loggedIn = isLoggedIn();
  const session = getSession();

  document.getElementById('app-header').classList.toggle('hidden', !loggedIn || PUBLIC_ROUTES.has(hash));

  if (!PUBLIC_ROUTES.has(hash) && !loggedIn) {
    location.hash = '#/login';
    return;
  }

  if (loggedIn && PUBLIC_ROUTES.has(hash)) {
    location.hash = DEFAULT_ROUTE[session.rol] || '#/login';
    return;
  }

  if (loggedIn && !allowedForRole(hash, session.rol)) {
    location.hash = DEFAULT_ROUTE[session.rol] || '#/login';
    return;
  }

  const route = resolveRoute(hash);
  if (!route) {
    location.hash = loggedIn ? DEFAULT_ROUTE[session.rol] : '#/login';
    return;
  }

  currentParams = route.params;
  showView(route.viewId);
  renderNav();

  if (loggedIn) {
    document.getElementById('user-label').textContent = `${session.nombre} (${session.rol})`;
  }

  const handler = viewHandlers.get(route.hash)
    || (route.params ? viewHandlers.get('pattern:perfil') : null);
  if (handler) await handler(route.params);
}

export function getRouteParams() {
  return currentParams;
}

export function initRouter() {
  window.addEventListener('hashchange', () => navigate());
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    logout();
    location.hash = '#/login';
  });
}
