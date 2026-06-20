import { request, adminRequest, formatDate } from '../api.js';
import { showToast, setLoading, esc, setupDialogClose, openDialog, badgeEstado, renderTable } from '../ui.js';

let categoriaDialogBound = false;
let notifDialogBound = false;
let usuarioDialogBound = false;
let usuariosTab = 'clientes';
let usuariosCache = [];

function servicioAdminCard(s, actions) {
  const cat = s.categoria?.nombre || '—';
  const trab = s.trabajador?.nombre || s.trabajador?.id || '—';
  const needsCert = s.categoria?.needsCertification ? ' · Requiere certificación' : '';
  return `
    <article class="card">
      <h3>${esc(s.titulo)}</h3>
      <p>${esc(s.descripcion)}</p>
      <div class="card-meta">${esc(cat)} · ${esc(trab)} · $${s.precioEstimadoPorHora ?? '—'}/h${needsCert}</div>
      <div class="card-meta">${s.isApproved ? 'Aprobado' : 'Pendiente'} · ${s.isActive !== false ? 'Activo' : 'Inactivo'}</div>
      <div class="btn-group">${actions}</div>
    </article>`;
}

function bindServicioAdminActions(container) {
  container.querySelectorAll('.btn-validar').forEach((btn) => {
    btn.addEventListener('click', async () => {
      setLoading(true);
      try {
        await request(`/servicios/validar/${btn.dataset.id}`, { method: 'PUT' });
        showToast('Servicio validado', 'success');
        await refreshAdminServiciosViews();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    });
  });

  container.querySelectorAll('.btn-invalidar').forEach((btn) => {
    btn.addEventListener('click', async () => {
      setLoading(true);
      try {
        await request(`/servicios/invalidar/${btn.dataset.id}`, { method: 'DELETE' });
        showToast('Servicio invalidado', 'success');
        await refreshAdminServiciosViews();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    });
  });

  container.querySelectorAll('.btn-activar').forEach((btn) => {
    btn.addEventListener('click', async () => {
      setLoading(true);
      try {
        await request(`/servicios/activar/${btn.dataset.id}`, { method: 'PUT' });
        showToast('Servicio activado', 'success');
        await refreshAdminServiciosViews();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    });
  });

  container.querySelectorAll('.btn-desactivar-svc').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Desactivar servicio?')) return;
      setLoading(true);
      try {
        await request(`/servicios/${btn.dataset.id}`, { method: 'DELETE' });
        showToast('Servicio desactivado', 'success');
        await refreshAdminServiciosViews();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    });
  });
}

function accionesServicio(s, soloCert = false) {
  const parts = [];
  if (!s.isApproved) {
    parts.push(`<button type="button" class="btn btn-primary btn-sm btn-validar" data-id="${s.id}">Aprobar</button>`);
    parts.push(`<button type="button" class="btn btn-danger btn-sm btn-invalidar" data-id="${s.id}">Rechazar</button>`);
  } else if (!soloCert) {
    parts.push(`<button type="button" class="btn btn-danger btn-sm btn-invalidar" data-id="${s.id}">Invalidar</button>`);
  }
  if (s.isActive === false) {
    parts.push(`<button type="button" class="btn btn-ghost btn-sm btn-activar" data-id="${s.id}">Activar</button>`);
  } else if (!soloCert) {
    parts.push(`<button type="button" class="btn btn-danger btn-sm btn-desactivar-svc" data-id="${s.id}">Desactivar</button>`);
  }
  return parts.join('') || '—';
}

async function refreshAdminServiciosViews() {
  if (location.hash === '#/admin/servicios') await renderAdminServicios();
  if (location.hash === '#/admin/certificacion') await renderAdminCertificacion();
}

export async function renderAdminCategorias() {
  setLoading(true);
  try {
    const cats = await request('/categorias');
    const container = document.getElementById('admin-categorias-list');

    if (!cats.length) {
      container.innerHTML = '<div class="empty-state">No hay categorías</div>';
      return;
    }

    container.innerHTML = renderTable(
      ['ID', 'Nombre', 'Certificación', 'Estado', 'Acciones'],
      cats.map((c) => [
        c.id,
        esc(c.nombre),
        c.needsCertification ? 'Sí' : 'No',
        c.isActive !== false ? 'Activa' : 'Inactiva',
        `<div class="btn-group">
          <button type="button" class="btn btn-ghost btn-sm btn-edit-cat" data-id="${c.id}">Editar</button>
          ${c.isActive !== false
            ? `<button type="button" class="btn btn-danger btn-sm btn-del-cat" data-id="${c.id}">Eliminar</button>`
            : `<button type="button" class="btn btn-primary btn-sm btn-react-cat" data-id="${c.id}">Reactivar</button>`}
        </div>`,
      ]),
    );

    bindCategoriaActions(cats);
  } finally {
    setLoading(false);
  }
}

function bindCategoriaActions(cats) {
  document.querySelectorAll('.btn-edit-cat').forEach((btn) => {
    btn.addEventListener('click', () => {
      const c = cats.find((x) => x.id === Number(btn.dataset.id));
      if (c) openCategoriaDialog(c);
    });
  });

  document.querySelectorAll('.btn-del-cat').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar categoría?')) return;
      setLoading(true);
      try {
        await request(`/categorias/${btn.dataset.id}`, { method: 'DELETE' });
        showToast('Categoría eliminada', 'success');
        await renderAdminCategorias();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    });
  });

  document.querySelectorAll('.btn-react-cat').forEach((btn) => {
    btn.addEventListener('click', async () => {
      setLoading(true);
      try {
        await request(`/categorias/reactivar/${btn.dataset.id}`, { method: 'PUT' });
        showToast('Categoría reactivada', 'success');
        await renderAdminCategorias();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    });
  });
}

function openCategoriaDialog(cat = null) {
  const dialog = document.getElementById('dialog-categoria');
  const form = document.getElementById('form-categoria');
  document.getElementById('categoria-form-title').textContent =
    cat ? 'Editar categoría' : 'Nueva categoría';

  if (cat) {
    form.elements.id.value = cat.id;
    form.elements.nombre.value = cat.nombre || '';
    form.elements.needsCertification.checked = !!cat.needsCertification;
  } else {
    form.reset();
    form.elements.id.value = '';
  }

  if (!categoriaDialogBound) {
    setupDialogClose(dialog);
    form.addEventListener('submit', submitCategoria);
    categoriaDialogBound = true;
  }

  openDialog(dialog);
}

async function submitCategoria(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.elements.id.value;
  const body = {
    nombre: form.elements.nombre.value,
    needsCertification: form.elements.needsCertification.checked,
  };

  setLoading(true);
  try {
    if (id) {
      await request(`/categorias/${id}`, { method: 'PUT', body });
      showToast('Categoría actualizada', 'success');
    } else {
      await request('/categorias', { method: 'POST', body });
      showToast('Categoría creada', 'success');
    }
    form.closest('dialog').close();
    await renderAdminCategorias();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

export async function renderAdminServicios() {
  setLoading(true);
  try {
    const servicios = await request('/servicios');
    const list = document.getElementById('admin-servicios-list');

    if (!servicios.length) {
      list.innerHTML = '<div class="empty-state">No hay servicios</div>';
      return;
    }

    list.innerHTML = servicios.map((s) => servicioAdminCard(s, accionesServicio(s))).join('');
    bindServicioAdminActions(list);
  } finally {
    setLoading(false);
  }
}

export async function renderAdminCertificacion() {
  setLoading(true);
  try {
    const servicios = await request('/servicios');
    const pendientes = servicios.filter(
      (s) => s.categoria?.needsCertification && !s.isApproved && s.isActive !== false,
    );
    const list = document.getElementById('admin-certificacion-list');

    if (!pendientes.length) {
      list.innerHTML = '<div class="empty-state">No hay servicios pendientes de certificación</div>';
      return;
    }

    list.innerHTML = pendientes.map((s) => servicioAdminCard(s, accionesServicio(s, true))).join('');
    bindServicioAdminActions(list);
  } finally {
    setLoading(false);
  }
}

export async function renderAdminReservas() {
  const estado = document.getElementById('admin-filtro-estado').value;
  setLoading(true);

  try {
    let reservas;
    if (estado) {
      reservas = await request(`/servicio_reservas/estado/${estado}`);
    } else {
      reservas = await request('/servicio_reservas');
      if (typeof reservas === 'string') reservas = [];
    }

    const list = Array.isArray(reservas) ? reservas : [];
    const container = document.getElementById('admin-reservas-list');

    if (!list.length) {
      container.innerHTML = '<div class="empty-state">No hay reservas</div>';
      return;
    }

    container.innerHTML = renderTable(
      ['ID', 'Cliente', 'Trabajador', 'Estado', 'Inicio', 'Acciones'],
      list.map((r) => [
        r.id,
        r.cliente?.nombre ?? r.cliente?.id ?? '—',
        r.trabajador?.nombre ?? r.trabajador?.id ?? '—',
        badgeEstado(r.estadoReserva),
        formatDate(r.inicio || r.fechaReservada),
        `<button type="button" class="btn btn-danger btn-sm btn-del-reserva" data-id="${r.id}">Eliminar</button>`,
      ]),
    );

    container.querySelectorAll('.btn-del-reserva').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Eliminar reserva?')) return;
        setLoading(true);
        try {
          await request(`/servicio_reservas/${btn.dataset.id}`, { method: 'DELETE' });
          showToast('Reserva eliminada', 'success');
          await renderAdminReservas();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setLoading(false);
        }
      });
    });
  } finally {
    setLoading(false);
  }
}

export async function renderAdminNotificaciones() {
  setLoading(true);
  try {
    const notifs = await request('/notificaciones');
    const container = document.getElementById('admin-notificaciones-list');

    if (!notifs.length) {
      container.innerHTML = '<div class="empty-state">No hay notificaciones</div>';
      return;
    }

    container.innerHTML = renderTable(
      ['ID', 'Título', 'Mensaje', 'Tipo', 'Leída', 'Acciones'],
      notifs.map((n) => [
        n.id,
        esc(n.titulo),
        esc(n.mensaje),
        esc(n.tipoNotificacion),
        n.leida ? 'Sí' : 'No',
        `<button type="button" class="btn btn-danger btn-sm btn-del-notif" data-id="${n.id}">Eliminar</button>`,
      ]),
    );

    container.querySelectorAll('.btn-del-notif').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Eliminar notificación?')) return;
        setLoading(true);
        try {
          await request(`/notificaciones/${btn.dataset.id}`, { method: 'DELETE' });
          showToast('Notificación eliminada', 'success');
          await renderAdminNotificaciones();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setLoading(false);
        }
      });
    });
  } finally {
    setLoading(false);
  }
}

async function submitNotificacion(e) {
  e.preventDefault();
  const form = e.target;
  setLoading(true);
  try {
    await request('/notificaciones', {
      method: 'POST',
      body: {
        titulo: form.elements.titulo.value,
        mensaje: form.elements.mensaje.value,
        tipoNotificacion: form.elements.tipoNotificacion.value,
        idUserDestino: Number(form.elements.idUserDestino.value),
        rol: form.elements.rol.value,
      },
    });
    showToast('Notificación creada', 'success');
    form.closest('dialog').close();
    form.reset();
    await renderAdminNotificaciones();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

function usuarioEndpoint(tipo, id = null) {
  if (tipo === 'admins') {
    return id != null ? `/admin/${id}` : '/admin';
  }
  const base = tipo === 'clientes' ? '/clientes' : '/trabajadores';
  return id != null ? `${base}/${id}` : base;
}

function openUsuarioDialog(user = null) {
  const dialog = document.getElementById('dialog-usuario');
  const form = document.getElementById('form-usuario');
  const tipo = usuariosTab;
  const isEdit = !!user;

  document.getElementById('usuario-form-title').textContent =
    isEdit ? 'Editar usuario' : 'Nuevo usuario';

  form.elements.tipo.value = tipo;
  form.elements.id.value = user?.id || '';
  form.elements.nombre.value = user?.nombre || '';
  form.elements.apellido.value = user?.apellido || '';
  form.elements.correo.value = user?.correo || '';
  form.elements.dni.value = user?.dni || '';
  form.elements.password.value = '';
  form.elements.password.required = !isEdit;

  if (!usuarioDialogBound) {
    setupDialogClose(dialog);
    form.addEventListener('submit', submitUsuario);
    usuarioDialogBound = true;
  }

  openDialog(dialog);
}

async function submitUsuario(e) {
  e.preventDefault();
  const form = e.target;
  const tipo = form.elements.tipo.value;
  const id = form.elements.id.value;
  const body = {
    nombre: form.elements.nombre.value,
    apellido: form.elements.apellido.value,
    correo: form.elements.correo.value,
    dni: form.elements.dni.value,
    isActive: true,
  };
  if (tipo === 'clientes') body.rol = 'CLIENTE';
  if (tipo === 'trabajadores') body.rol = 'TRABAJADOR';
  if (tipo === 'admins') body.rol = 'ADMIN';
  if (form.elements.password.value) {
    body.password = form.elements.password.value;
    body.username = body.correo;
  }

  setLoading(true);
  try {
    const path = usuarioEndpoint(tipo, id || null);
    if (id) {
      const req = tipo === 'admins' ? adminRequest : request;
      await req(path, { method: 'PUT', body });
      showToast('Usuario actualizado', 'success');
    } else {
      const req = tipo === 'admins' ? adminRequest : request;
      await req(usuarioEndpoint(tipo), { method: 'POST', body });
      showToast('Usuario creado', 'success');
    }
    form.closest('dialog').close();
    await renderAdminUsuarios();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
}

export async function renderAdminUsuarios() {
  setLoading(true);
  try {
    if (usuariosTab === 'clientes') {
      usuariosCache = await request('/clientes');
    } else if (usuariosTab === 'trabajadores') {
      usuariosCache = await request('/trabajadores');
    } else {
      usuariosCache = await adminRequest('');
      if (!Array.isArray(usuariosCache)) usuariosCache = [];
    }

    const container = document.getElementById('admin-usuarios-list');
    if (!usuariosCache.length) {
      container.innerHTML = '<div class="empty-state">No hay usuarios</div>';
      return;
    }

    container.innerHTML = renderTable(
      ['ID', 'Nombre', 'Correo', 'Rol', 'Activo', 'Acciones'],
      usuariosCache.map((u) => [
        u.id,
        esc(u.nombre),
        esc(u.correo),
        esc(u.rol),
        u.isActive !== false ? 'Sí' : 'No',
        `<div class="btn-group">
          <button type="button" class="btn btn-ghost btn-sm btn-edit-user" data-id="${u.id}">Editar</button>
          ${u.isActive !== false
            ? `<button type="button" class="btn btn-danger btn-sm btn-del-user" data-id="${u.id}">Desactivar</button>`
            : '—'}
        </div>`,
      ]),
    );

    container.querySelectorAll('.btn-edit-user').forEach((btn) => {
      btn.addEventListener('click', () => {
        const u = usuariosCache.find((x) => x.id === Number(btn.dataset.id));
        if (u) openUsuarioDialog(u);
      });
    });

    container.querySelectorAll('.btn-del-user').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Desactivar usuario?')) return;
        setLoading(true);
        try {
          const id = btn.dataset.id;
          if (usuariosTab === 'admins') {
            await adminRequest(`/${id}`, { method: 'DELETE' });
          } else {
            await request(usuarioEndpoint(usuariosTab, id), { method: 'DELETE' });
          }
          showToast('Usuario desactivado', 'success');
          await renderAdminUsuarios();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setLoading(false);
        }
      });
    });
  } finally {
    setLoading(false);
  }
}

export function initAdminEvents() {
  document.getElementById('btn-nueva-categoria').addEventListener('click', () => openCategoriaDialog());
  document.getElementById('btn-nuevo-usuario').addEventListener('click', () => openUsuarioDialog());

  const notifDialog = document.getElementById('dialog-notificacion');
  document.getElementById('btn-nueva-notificacion').addEventListener('click', () => {
    if (!notifDialogBound) {
      setupDialogClose(notifDialog);
      document.getElementById('form-notificacion').addEventListener('submit', submitNotificacion);
      notifDialogBound = true;
    }
    openDialog(notifDialog);
  });

  document.getElementById('admin-filtro-estado').addEventListener('change', () => {
    if (location.hash === '#/admin/reservas') renderAdminReservas();
  });

  document.querySelectorAll('#view-admin-usuarios .tabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#view-admin-usuarios .tabs .tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      usuariosTab = tab.dataset.tab;
      if (location.hash === '#/admin/usuarios') renderAdminUsuarios();
    });
  });

  document.getElementById('btn-admin-nuevo-servicio')?.addEventListener('click', () => {
    showToast('Creá servicios desde la cuenta del trabajador o editá los existentes aquí.', 'info');
  });
}
