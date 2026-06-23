import { request, buscarServicios, geocodeAddress, formatDate, formatTime } from '../api.js';
import { getSession } from '../auth.js';
import { showToast, setLoading, esc, setupDialogClose, openDialog, badgeEstado, renderTable } from '../ui.js';
import { userNameLink, bindProfileLinks, formatPuntaje } from '../profile.js';
import {
  fetchReservasFinalizadas,
  fillReservaSelect,
  endpointReseniasEnviadas,
  renderReseniasEnviadasHtml,
  submitReseniaForm,
} from './shared.js';

let reservaDialogBound = false;
let categoriasCache = [];
let serviciosActuales = [];
let reseniasClienteSort = 'desc';

async function loadCategorias() {
  if (categoriasCache.length) return categoriasCache;
  categoriasCache = await request('/categorias');
  return categoriasCache.filter((c) => c.isActive !== false);
}

async function populateCategoriaFilter() {
  const cats = await loadCategorias();
  const select = document.querySelector('#form-filtros-servicios select[name="idCategoria"]');
  if (!select) return;
  select.innerHTML = '<option value="">Todas</option>' +
    cats.map((c) => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('');
}

function servicioCard(s, withReserva = true) {
  const cat = s.categoria?.nombre || 'Sin categoría';
  const trabLink = s.trabajador?.id
    ? userNameLink('trabajador', s.trabajador)
    : '—';
  const trabData = s.trabajador
    ? JSON.stringify(s.trabajador).replace(/'/g, '&#39;')
    : '';
  return `
    <article class="card" data-id="${s.id}" ${trabData ? `data-profile-data='${trabData}'` : ''}>
      <h3>${esc(s.titulo)}</h3>
      <p>${esc(s.descripcion)}</p>
      <div class="card-meta">
        ${esc(cat)} · ${trabLink}<br>
        $${s.precioEstimadoPorHora ?? '—'}/h · mín. ${s.minTiempo ?? '—'} min
      </div>
      ${withReserva ? `<button type="button" class="btn btn-primary btn-sm btn-reservar" data-id="${s.id}">Reservar</button>` : ''}
    </article>`;
}

function renderServiciosList(servicios) {
  const list = document.getElementById('servicios-list');
  const activos = servicios.filter((s) => s.isActive !== false && s.isApproved);
  serviciosActuales = activos;

  if (!activos.length) {
    list.innerHTML = '<div class="empty-state">No hay servicios disponibles</div>';
    return;
  }

  list.innerHTML = activos.map((s) => servicioCard(s)).join('');
  bindProfileLinks(list);
  list.querySelectorAll('.btn-reservar').forEach((btn) => {
    btn.addEventListener('click', () => openReservaDialog(Number(btn.dataset.id)));
  });
}

async function fetchServicios(filtros = {}) {
  try {
    return await buscarServicios(filtros);
  } catch (err) {
    if (err.status === 403 || err.status === 404) {
      const todos = await request('/servicios');
      let result = todos.filter((s) => s.isActive !== false && s.isApproved);
      if (filtros.idCategoria) {
        result = result.filter((s) => s.categoria?.id === Number(filtros.idCategoria));
      }
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        result = result.filter((s) =>
          s.titulo?.toLowerCase().includes(q) || s.descripcion?.toLowerCase().includes(q));
      }
      return result;
    }
    throw err;
  }
}

export async function renderServicios() {
  await populateCategoriaFilter();
  setLoading(true);
  try {
    const servicios = await fetchServicios();
    renderServiciosList(servicios);
  } finally {
    setLoading(false);
  }
}

async function aplicarFiltros(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const filtros = {
    idCategoria: fd.get('idCategoria') || undefined,
    busqueda: fd.get('busqueda') || undefined,
    radioKm: fd.get('radioKm') ? Number(fd.get('radioKm')) : undefined,
  };

  const direccion = fd.get('direccion')?.trim();
  if (direccion) {
    setLoading(true);
    try {
      const { lat, lng } = await geocodeAddress(direccion);
      filtros.lat = lat;
      filtros.lng = lng;
    } catch (err) {
      showToast(err.message, 'error');
      setLoading(false);
      return;
    }
  }

  setLoading(true);
  try {
    const servicios = await fetchServicios(filtros);
    renderServiciosList(servicios);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

function openReservaDialog(servicioId) {
  const s = serviciosActuales.find((x) => x.id === servicioId);
  if (!s) return;

  const dialog = document.getElementById('dialog-reserva');
  const form = document.getElementById('form-reserva');
  document.getElementById('reserva-servicio-info').textContent =
    `${s.titulo} — ${s.trabajador?.nombre || 'Trabajador'}`;
  form.elements.idServicio.value = s.id;
  form.elements.idTrabajador.value = s.trabajador?.id;
  form.elements.fechaReservada.value = '';
  form.elements.horaInicio.value = '';
  form.elements.horaFin.value = '';

  if (!reservaDialogBound) {
    setupDialogClose(dialog);
    form.addEventListener('submit', submitReserva);
    reservaDialogBound = true;
  }

  openDialog(dialog);
}

function normalizeTime(value) {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
}

async function submitReserva(e) {
  e.preventDefault();
  const form = e.target;
  const { userId } = getSession();

  setLoading(true);
  try {
    await request('/servicio_reservas', {
      method: 'POST',
      body: {
        idCliente: userId,
        idTrabajador: Number(form.elements.idTrabajador.value),
        idServicio: Number(form.elements.idServicio.value),
        fechaReservada: form.elements.fechaReservada.value,
        horaInicio: normalizeTime(form.elements.horaInicio.value),
        horaFin: normalizeTime(form.elements.horaFin.value),
      },
    });
    showToast('Reserva creada', 'success');
    form.closest('dialog').close();
    location.hash = '#/reservas';
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function cancelarReserva(id) {
  if (!confirm('¿Cancelar esta reserva?')) return;
  setLoading(true);
  try {
    await request(`/servicio_reservas/rechazar/${id}`, { method: 'PATCH' });
    showToast('Reserva cancelada', 'success');
    await renderReservas();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

export async function renderReservas() {
  const estado = document.getElementById('filtro-estado-reserva').value;
  setLoading(true);

  try {
    const reservas = await request(`/servicio_reservas/enviadas/${estado}`);
    const list = Array.isArray(reservas) ? reservas : [];
    const container = document.getElementById('reservas-list');

    if (!list.length) {
      container.innerHTML = '<div class="empty-state">No tenés reservas en este estado</div>';
      return;
    }

    container.innerHTML = renderTable(
      ['ID', 'Servicio', 'Trabajador', 'Día', 'Horario', 'Estado', 'Acciones'],
      list.map((r) => {
        const acciones = r.estadoReserva === 'PENDIENTE'
          ? `<button type="button" class="btn btn-danger btn-sm btn-cancelar-reserva" data-id="${r.id}">Cancelar</button>`
          : '—';
        const inicio = r.inicio || r.fechaReservada;
        const fin = r.fin;
        const horario = fin
          ? `${formatTime(inicio)} – ${formatTime(fin)}`
          : formatTime(inicio);
        const trabJson = r.trabajador
          ? JSON.stringify(r.trabajador).replace(/'/g, '&#39;')
          : '';
        const trabajadorCell = r.trabajador?.id
          ? `<span data-profile-data='${trabJson}'>${userNameLink('trabajador', r.trabajador)}</span>`
          : '—';
        return [
          r.id,
          r.servicio?.titulo || '—',
          trabajadorCell,
          formatDate(r.fechaReservada || inicio).split(',')[0],
          horario,
          badgeEstado(r.estadoReserva),
          acciones,
        ];
      }),
    );

    bindProfileLinks(container);

    container.querySelectorAll('.btn-cancelar-reserva').forEach((btn) => {
      btn.addEventListener('click', () => cancelarReserva(Number(btn.dataset.id)));
    });
  } finally {
    setLoading(false);
  }
}

export async function renderPerfilCliente() {
  setLoading(true);
  try {
    const cliente = await request('/clientes/perfil');
    const form = document.getElementById('form-perfil-cliente');
    form.innerHTML = `
      <p class="card-meta">Puntaje: <strong>${formatPuntaje(cliente.puntaje)}</strong></p>
      <label>Nombre<input name="nombre" value="${esc(cliente.nombre)}" required></label>
      <label>Apellido<input name="apellido" value="${esc(cliente.apellido || '')}"></label>
      <label>DNI<input name="dni" value="${esc(cliente.dni || '')}"></label>
      <label>Descripción<textarea name="descripcion" rows="3">${esc(cliente.descripcion || '')}</textarea></label>
      <label>Correo<input value="${esc(cliente.correo)}" disabled></label>
      <button type="submit" class="btn btn-primary">Guardar cambios</button>`;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      setLoading(true);
      try {
        await request('/clientes/perfil', {
          method: 'POST',
          body: {
            nombre: fd.get('nombre'),
            apellido: fd.get('apellido'),
            dni: fd.get('dni'),
            descripcion: fd.get('descripcion'),
          },
        });
        showToast('Perfil actualizado', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
  } finally {
    setLoading(false);
  }
}

export async function renderResenias() {
  setLoading(true);

  try {
    const [resenias, reservas] = await Promise.all([
      request(endpointReseniasEnviadas('CLIENTE')),
      fetchReservasFinalizadas('CLIENTE'),
    ]);
    document.getElementById('resenias-list').innerHTML =
      renderReseniasEnviadasHtml(resenias, reseniasClienteSort, 'CLIENTE');
    fillReservaSelect(document.getElementById('resenia-reserva-cliente'), reservas, 'CLIENTE');

    const form = document.getElementById('form-resenia');
    form.onsubmit = async (e) => {
      e.preventDefault();
      await submitReseniaForm(form, 'CLIENTE', renderResenias);
    };
  } finally {
    setLoading(false);
  }
}

export function initClienteEvents() {
  document.getElementById('filtro-estado-reserva').addEventListener('change', () => {
    if (location.hash === '#/reservas') renderReservas();
  });

  document.getElementById('filtro-orden-resenias-cliente')?.addEventListener('change', (e) => {
    reseniasClienteSort = e.target.value;
    if (location.hash === '#/resenias') renderResenias();
  });

  document.getElementById('form-filtros-servicios').addEventListener('submit', aplicarFiltros);
  document.getElementById('btn-limpiar-filtros').addEventListener('click', () => {
    document.getElementById('form-filtros-servicios').reset();
    renderServicios();
  });
}
