let toastTimer = null;

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : type === 'success' ? 'success' : ''}`;
  el.textContent = message;
  container.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 4000);
}

export function setLoading(visible) {
  document.getElementById('loading').classList.toggle('hidden', !visible);
}

export function badgeEstado(estado) {
  const map = {
    PENDIENTE: 'badge-pendiente',
    APROBADO: 'badge-aprobado',
    RECHAZADO: 'badge-rechazado',
    FINALIZADO: 'badge-finalizado',
  };
  const cls = map[estado] || 'badge-inactivo';
  return `<span class="badge ${cls}">${estado || '—'}</span>`;
}

export function renderTable(headers, rows) {
  if (!rows.length) {
    return '<div class="empty-state">No hay datos para mostrar</div>';
  }
  const head = headers.map((h) => `<th>${h}</th>`).join('');
  const body = rows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function setupDialogClose(dialog) {
  dialog.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });
}

export function fillForm(form, data) {
  Object.entries(data).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    if (field.type === 'checkbox') {
      field.checked = !!value;
    } else {
      field.value = value ?? '';
    }
  });
}

export function formToObject(form) {
  const fd = new FormData(form);
  const obj = {};
  fd.forEach((value, key) => {
    obj[key] = value;
  });
  const checkbox = form.querySelector('input[type=checkbox][name]');
  if (checkbox && !fd.has(checkbox.name)) {
    obj[checkbox.name] = false;
  }
  return obj;
}

export function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
