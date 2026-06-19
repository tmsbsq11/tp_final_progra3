import { request, fromDatetimeLocal, formatDate } from '../api.js';
import { getSession } from '../auth.js';
import { showToast, setLoading, esc, setupDialogClose, badgeEstado, renderTable } from '../ui.js';

let reservaDialogBound = false;

function servicioCard(s, withReserva = true) {
  const cat = s.categoria?.nombre || 'Sin categoría';
  const trab = s.trabajador?.nombre || `Trabajador #${s.trabajador?.id || '?'}`;
  const approved = s.isApproved ? 'Aprobado' : 'Pendiente';
  const active = s.isActive !== false ? 'Activo' : 'Inactivo';
  return `
    <article class="card" data-id="${s.id}">
      <h3>${esc(s.titulo)}</h3>
      <p>${esc(s.descripcion)}</p>
      <div class="card-meta">
        ${esc(cat)} · ${esc(trab)}<br>
        $${s.precioEstimadoPorHora ?? '—'}/h · mín. ${s.minTiempo ?? '—'} min<br>
        ${approved} · ${active}
      </div>
      ${withReserva ? `<button type="button" class="btn btn-primary btn-sm btn-reservar" data-id="${s.id}">Reservar</button>` : ''}
    </article>`;
}

export async function renderServicios() {
  setLoading(true);
  try {
    const servicios = await request('/servicios');
    const activos = servicios.filter((s) => s.isActive !== false && s.isApproved);
    const list = document.getElementById('servicios-list');

    if (!activos.length) {
      list.innerHTML = '<div class="empty-state">No hay servicios disponibles</div>';
      return;
    }

    list.innerHTML = activos.map((s) => servicioCard(s)).join('');
    list.querySelectorAll('.btn-reservar').forEach((btn) => {
      btn.addEventListener('click', () => openReservaDialog(Number(btn.dataset.id), activos));
    });
  } finally {
    setLoading(false);
  }
}

function openReservaDialog(servicioId, servicios) {
  const s = servicios.find((x) => x.id === servicioId);
  if (!s) return;

  const dialog = document.getElementById('dialog-reserva');
  const form = document.getElementById('form-reserva');
  document.getElementById('reserva-servicio-info').textContent =
    `${s.titulo} — ${s.trabajador?.nombre || 'Trabajador'}`;
  form.elements.idServicio.value = s.id;
  form.elements.idTrabajador.value = s.trabajador?.id;

  if (!reservaDialogBound) {
    setupDialogClose(dialog);
    form.addEventListener('submit', submitReserva);
    reservaDialogBound = true;
  }

  dialog.showModal();
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
        fechaReservada: fromDatetimeLocal(form.elements.fechaReservada.value),
        fechaInicio: fromDatetimeLocal(form.elements.fechaInicio.value),
        fechaFin: fromDatetimeLocal(form.elements.fechaFin.value),
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

export async function renderReservas() {
  const estado = document.getElementById('filtro-estado-reserva').value;
  const { userId } = getSession();
  setLoading(true);

  try {
    const reservas = await request(`/servicio_reservas/estado/${estado}`);
    const list = Array.isArray(reservas) ? reservas : [];
    const mias = list.filter((r) => r.cliente?.id === userId);

    const container = document.getElementById('reservas-list');
    if (!mias.length) {
      container.innerHTML = '<div class="empty-state">No tenés reservas en este estado</div>';
      return;
    }

    container.innerHTML = renderTable(
      ['ID', 'Servicio', 'Estado', 'Inicio', 'Fin'],
      mias.map((r) => [
        r.id,
        r.servicio?.titulo || '—',
        badgeEstado(r.estadoReserva),
        formatDate(r.inicio || r.fechaInicio),
        formatDate(r.fin || r.fechaFin),
      ]),
    );
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
  const { userId } = getSession();
  setLoading(true);

  try {
    const resenias = await request(`/resenias/cliente/${userId}`);
    const list = document.getElementById('resenias-list');

    if (!resenias?.length) {
      list.innerHTML = '<div class="empty-state">Sin reseñas</div>';
    } else {
      list.innerHTML = resenias.map((r) => `
        <div class="card" style="margin-bottom:0.75rem">
          <strong>${r.puntaje ?? '—'} ★</strong> — ${esc(r.comentario || 'Sin comentario')}
          <div class="card-meta">${esc(r.direccionResenia)} · ${formatDate(r.fechaCreacion)}</div>
        </div>`).join('');
    }

    const form = document.getElementById('form-resenia');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      setLoading(true);
      try {
        await request('/resenias', {
          method: 'POST',
          body: {
            idCliente: userId,
            idTrabajador: Number(fd.get('idTrabajador')),
            puntaje: Number(fd.get('puntaje')),
            comentario: fd.get('comentario'),
            direccionResenia: fd.get('direccionResenia'),
          },
        });
        showToast('Reseña publicada', 'success');
        form.reset();
        await renderResenias();
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

export function initClienteEvents() {
  document.getElementById('filtro-estado-reserva').addEventListener('change', () => {
    if (location.hash === '#/reservas') renderReservas();
  });
}
