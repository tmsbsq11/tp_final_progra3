import { request } from '../api.js';
import { getSession } from '../auth.js';
import { showToast, setLoading, esc } from '../ui.js';
import { formatDate } from '../api.js';
import { loadProfileSnapshot, formatPuntaje, sortByPuntaje } from '../profile.js';

let reseniasSortOrder = 'desc';

export function parsePerfilRoute(hash) {
  const m = hash.match(/^#\/perfil\/(cliente|trabajador)\/(\d+)$/);
  if (!m) return null;
  return { tipo: m[1], id: Number(m[2]) };
}

async function fetchUser(tipo, id, snapshot) {
  const base = snapshot || loadProfileSnapshot(tipo, id) || { id };

  try {
    if (tipo === 'cliente') {
      const data = await request(`/clientes/${id}`, { silent: true });
      return { ...base, ...data, tipo: 'cliente' };
    }
    const data = await request(`/trabajadores/${id}`, { silent: true });
    return { ...base, ...data, tipo: 'trabajador' };
  } catch {
    return { ...base, tipo };
  }
}

function renderReseniasList(resenias, container) {
  const sorted = sortByPuntaje(resenias, reseniasSortOrder);
  if (!sorted.length) {
    container.innerHTML = '<div class="empty-state">Sin reseñas</div>';
    return;
  }
  container.innerHTML = sorted.map((r) => `
    <div class="card" style="margin-bottom:0.75rem">
      <strong>${formatPuntaje(r.puntaje)}</strong> — ${esc(r.comentario || 'Sin comentario')}
      <div class="card-meta">${esc(r.direccionResenia || '')} · ${formatDate(r.fechaCreacion)}</div>
    </div>`).join('');
}

export async function renderPerfilPublico(params) {
  const { tipo, id } = params;
  const view = document.getElementById('view-perfil-publico');
  setLoading(true);

  try {
    const user = await fetchUser(tipo, id);
    const reseniasPath = tipo === 'cliente' ? `/resenias/cliente/${id}` : `/resenias/trabajador/${id}`;
    let resenias = [];
    try {
      resenias = await request(reseniasPath);
    } catch { /* sin reseñas */ }

    view.innerHTML = `
      <div class="page-header">
        <h1>Perfil de ${tipo === 'cliente' ? 'cliente' : 'trabajador'}</h1>
        <button type="button" class="btn btn-ghost" id="btn-volver-perfil">← Volver</button>
      </div>
      <div class="form-card">
        <h2>${esc(user.nombre)} ${esc(user.apellido || '')}</h2>
        <p class="card-meta">Puntaje: <strong>${formatPuntaje(user.puntaje)}</strong></p>
        ${user.descripcion ? `<p>${esc(user.descripcion)}</p>` : ''}
        ${user.correo ? `<p class="card-meta">Correo: ${esc(user.correo)}</p>` : ''}
        ${tipo === 'trabajador' && user.latitud != null
          ? `<p class="card-meta">Ubicación: ${user.latitud}, ${user.longitud}</p>` : ''}
      </div>
      <div class="page-header" style="margin-top:1.5rem">
        <h2>Reseñas</h2>
        <select id="filtro-orden-resenias">
          <option value="desc">Mayor a menor puntaje</option>
          <option value="asc">Menor a mayor puntaje</option>
        </select>
      </div>
      <div id="perfil-publico-resenias"></div>`;

    const resContainer = document.getElementById('perfil-publico-resenias');
    const sortSelect = document.getElementById('filtro-orden-resenias');
    sortSelect.value = reseniasSortOrder;
    renderReseniasList(resenias, resContainer);

    sortSelect.addEventListener('change', () => {
      reseniasSortOrder = sortSelect.value;
      renderReseniasList(resenias, resContainer);
    });

    document.getElementById('btn-volver-perfil').addEventListener('click', () => {
      history.back();
    });
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

export function filterMisNotificaciones(notificaciones) {
  const { userId, rol } = getSession();
  return notificaciones.filter(
    (n) => n.idDestino === userId && n.rol === rol,
  );
}

export async function renderNotificaciones() {
  setLoading(true);
  try {
    const todas = await request('/notificaciones');
    const notifs = filterMisNotificaciones(Array.isArray(todas) ? todas : []);
    const container = document.getElementById('notificaciones-list');

    if (!notifs.length) {
      container.innerHTML = '<div class="empty-state">No tenés notificaciones</div>';
      return;
    }

    notifs.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    container.innerHTML = notifs.map((n) => `
      <article class="card ${n.leida ? '' : 'card-unread'}" style="margin-bottom:0.75rem">
        <h3>${esc(n.titulo)} ${n.leida ? '' : '<span class="badge badge-pendiente">Nueva</span>'}</h3>
        <p>${esc(n.mensaje)}</p>
        <div class="card-meta">${esc(n.tipoNotificacion)} · ${formatDate(n.fechaCreacion)}</div>
      </article>`).join('');
  } finally {
    setLoading(false);
  }
}
