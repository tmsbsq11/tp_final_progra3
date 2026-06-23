import { request, formatDate, formatTime } from '../api.js';
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

let servicioDialogBound = false;
let categoriasCache = [];
let reseniasTrabajadorSort = 'desc';

async function loadCategorias() {
  if (categoriasCache.length) return categoriasCache;
  categoriasCache = await request('/categorias');
  return categoriasCache.filter((c) => c.isActive !== false);
}

function servicioCard(s, editable = true) {
  const cat = s.categoria?.nombre || 'Sin categoría';
  const approved = s.isApproved ? 'Aprobado' : 'Pendiente validación';
  return `
    <article class="card">
      <h3>${esc(s.titulo)}</h3>
      <p>${esc(s.descripcion)}</p>
      <div class="card-meta">
        ${esc(cat)} · $${s.precioEstimadoPorHora ?? '—'}/h · ${s.minTiempo ?? '—'} min<br>
        ${approved} · ${s.isActive !== false ? 'Activo' : 'Inactivo'}
      </div>
      ${editable ? `
        <div class="btn-group">
          <button type="button" class="btn btn-ghost btn-sm btn-editar-servicio" data-id="${s.id}">Editar</button>
          <button type="button" class="btn btn-danger btn-sm btn-borrar-servicio" data-id="${s.id}">Desactivar</button>
        </div>` : ''}
    </article>`;
}

export async function renderMisServicios() {
  const { userId } = getSession();
  setLoading(true);

  try {
    const servicios = await request('/servicios');
    const mios = servicios.filter((s) => s.trabajador?.id === userId);
    const list = document.getElementById('mis-servicios-list');

    if (!mios.length) {
      list.innerHTML = '<div class="empty-state">Todavía no publicaste servicios</div>';
    } else {
      list.innerHTML = mios.map((s) => servicioCard(s)).join('');
      bindServicioActions(mios);
    }
  } finally {
    setLoading(false);
  }
}

function bindServicioActions(servicios) {
  document.querySelectorAll('.btn-editar-servicio').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = servicios.find((x) => x.id === Number(btn.dataset.id));
      if (s) openServicioDialog(s);
    });
  });

  document.querySelectorAll('.btn-borrar-servicio').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Desactivar este servicio?')) return;
      setLoading(true);
      try {
        await request(`/servicios/${btn.dataset.id}`, { method: 'DELETE' });
        showToast('Servicio desactivado', 'success');
        await renderMisServicios();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    });
  });
}

async function openServicioDialog(servicio = null) {
  const dialog = document.getElementById('dialog-servicio');
  const form = document.getElementById('form-servicio');
  const cats = await loadCategorias();
  const select = form.elements.idCategoria;
  select.innerHTML = cats.map((c) =>
    `<option value="${c.id}">${esc(c.nombre)}</option>`).join('');

  document.getElementById('servicio-form-title').textContent =
    servicio ? 'Editar servicio' : 'Nuevo servicio';

  if (servicio) {
    form.elements.id.value = servicio.id;
    form.elements.titulo.value = servicio.titulo || '';
    form.elements.descripcion.value = servicio.descripcion || '';
    form.elements.idCategoria.value = servicio.categoria?.id || '';
    form.elements.minTiempo.value = servicio.minTiempo ?? 30;
    form.elements.precioEstimadoPorHora.value = servicio.precioEstimadoPorHora ?? '';
  } else {
    form.reset();
    form.elements.id.value = '';
    form.elements.minTiempo.value = 30;
  }

  if (!servicioDialogBound) {
    setupDialogClose(dialog);
    form.addEventListener('submit', submitServicio);
    servicioDialogBound = true;
  }

  openDialog(dialog);
}

async function submitServicio(e) {
  e.preventDefault();
  const form = e.target;
  const { userId } = getSession();
  const id = form.elements.id.value;
  const body = {
    titulo: form.elements.titulo.value,
    descripcion: form.elements.descripcion.value,
    idCategoria: Number(form.elements.idCategoria.value),
    idTrabajador: userId,
    minTiempo: Number(form.elements.minTiempo.value),
    precioEstimadoPorHora: Number(form.elements.precioEstimadoPorHora.value),
  };

  setLoading(true);
  try {
    if (id) {
      await request(`/servicios/${id}`, { method: 'PUT', body });
      showToast('Servicio actualizado', 'success');
    } else {
      await request('/servicios', { method: 'POST', body });
      showToast('Servicio creado', 'success');
    }
    form.closest('dialog').close();
    await renderMisServicios();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function cambiarEstadoReserva(id, accion) {
  const msg = accion === 'aceptar' ? '¿Aceptar esta reserva?' : '¿Rechazar esta reserva?';
  if (!confirm(msg)) return;
  setLoading(true);
  try {
    await request(`/servicio_reservas/${accion}/${id}`, { method: 'PATCH' });
    showToast(accion === 'aceptar' ? 'Reserva aceptada' : 'Reserva rechazada', 'success');
    await renderReservasRecibidas();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

export async function renderReservasRecibidas() {
  const estado = document.getElementById('filtro-estado-recibidas').value;
  setLoading(true);

  try {
    const reservas = await request(`/servicio_reservas/recibidas/${estado}`);
    const list = Array.isArray(reservas) ? reservas : [];
    const container = document.getElementById('reservas-recibidas-list');

    if (!list.length) {
      container.innerHTML = '<div class="empty-state">No hay solicitudes en este estado</div>';
      return;
    }

    container.innerHTML = renderTable(
      ['ID', 'Cliente', 'Servicio', 'Día', 'Horario', 'Estado', 'Acciones'],
      list.map((r) => {
        const inicio = r.inicio || r.fechaReservada;
        const fin = r.fin;
        const horario = fin
          ? `${formatTime(inicio)} – ${formatTime(fin)}`
          : formatTime(inicio);
        let acciones = '—';
        if (r.estadoReserva === 'PENDIENTE') {
          acciones = `
            <div class="btn-group">
              <button type="button" class="btn btn-primary btn-sm btn-aceptar-reserva" data-id="${r.id}">Aceptar</button>
              <button type="button" class="btn btn-danger btn-sm btn-rechazar-reserva" data-id="${r.id}">Rechazar</button>
            </div>`;
        }
        const cliJson = r.cliente
          ? JSON.stringify(r.cliente).replace(/'/g, '&#39;')
          : '';
        const clienteCell = r.cliente?.id
          ? `<span data-profile-data='${cliJson}'>${userNameLink('cliente', r.cliente)}</span>`
          : '—';
        return [
          r.id,
          clienteCell,
          r.servicio?.titulo || '—',
          formatDate(r.fechaReservada || inicio).split(',')[0],
          horario,
          badgeEstado(r.estadoReserva),
          acciones,
        ];
      }),
    );

    bindProfileLinks(container);
    container.querySelectorAll('.btn-aceptar-reserva').forEach((btn) => {
      btn.addEventListener('click', () => cambiarEstadoReserva(Number(btn.dataset.id), 'aceptar'));
    });
    container.querySelectorAll('.btn-rechazar-reserva').forEach((btn) => {
      btn.addEventListener('click', () => cambiarEstadoReserva(Number(btn.dataset.id), 'rechazar'));
    });
  } finally {
    setLoading(false);
  }
}

export async function renderReseniasTrabajador() {
  setLoading(true);
  try {
    const [resenias, reservas] = await Promise.all([
      request(endpointReseniasEnviadas('TRABAJADOR')),
      fetchReservasFinalizadas('TRABAJADOR'),
    ]);
    document.getElementById('resenias-trabajador-list').innerHTML =
      renderReseniasEnviadasHtml(resenias, reseniasTrabajadorSort, 'TRABAJADOR');
    fillReservaSelect(document.getElementById('resenia-reserva-trabajador'), reservas, 'TRABAJADOR');

    const form = document.getElementById('form-resenia-trabajador');
    form.onsubmit = async (e) => {
      e.preventDefault();
      await submitReseniaForm(form, 'TRABAJADOR', renderReseniasTrabajador);
    };
  } finally {
    setLoading(false);
  }
}

export async function renderPerfilTrabajador() {
  setLoading(true);
  try {
    const t = await request('/trabajadores/perfil');
    const form = document.getElementById('form-perfil-trabajador');
    form.innerHTML = `
      <p class="card-meta">Puntaje: <strong>${formatPuntaje(t.puntaje)}</strong></p>
      <label>Nombre<input name="nombre" value="${esc(t.nombre)}" required></label>
      <label>Apellido<input name="apellido" value="${esc(t.apellido || '')}"></label>
      <label>DNI<input name="dni" value="${esc(t.dni || '')}"></label>
      <label>Descripción<textarea name="descripcion" rows="3">${esc(t.descripcion || '')}</textarea></label>
      <label>Min. minutos entre reservas<input type="number" name="minutosMinimoEntreReservas" value="${t.minutosMinimoEntreReservas ?? ''}" min="0"></label>
      <label>Correo<input value="${esc(t.correo)}" disabled></label>
      <p class="card-meta">Ubicación: ${t.latitud != null ? `${t.latitud}, ${t.longitud}` : 'Sin definir'}</p>
      <button type="submit" class="btn btn-primary">Guardar cambios</button>`;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      setLoading(true);
      try {
        await request('/trabajadores/perfil', {
          method: 'PUT',
          body: {
            nombre: fd.get('nombre'),
            apellido: fd.get('apellido'),
            dni: fd.get('dni'),
            descripcion: fd.get('descripcion'),
            minutosMinimoEntreReservas: fd.get('minutosMinimoEntreReservas')
              ? Number(fd.get('minutosMinimoEntreReservas')) : null,
          },
        });
        showToast('Perfil actualizado', 'success');
        await renderPerfilTrabajador();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    const ubicForm = document.getElementById('form-ubicacion');
    ubicForm.onsubmit = async (e) => {
      e.preventDefault();
      const direccion = new FormData(ubicForm).get('direccion');
      setLoading(true);
      try {
        await request(`/trabajadores/${t.id}/ubicacion?direccion=${encodeURIComponent(direccion)}`, {
          method: 'PUT',
        });
        showToast('Ubicación actualizada', 'success');
        await renderPerfilTrabajador();
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

export function initTrabajadorEvents() {
  document.getElementById('btn-nuevo-servicio').addEventListener('click', () => openServicioDialog());
  document.getElementById('filtro-estado-recibidas').addEventListener('change', () => {
    if (location.hash === '#/reservas-recibidas') renderReservasRecibidas();
  });
  document.getElementById('filtro-orden-resenias-trabajador')?.addEventListener('change', (e) => {
    reseniasTrabajadorSort = e.target.value;
    if (location.hash === '#/resenias-trabajador') renderReseniasTrabajador();
  });
}
