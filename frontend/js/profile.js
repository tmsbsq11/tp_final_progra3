export function formatPuntaje(puntaje) {
  if (puntaje == null || Number.isNaN(Number(puntaje))) return 'Sin puntaje';
  return `${Number(puntaje).toFixed(1)} ★`;
}

export function sortByPuntaje(items, order = 'desc') {
  return [...items].sort((a, b) => {
    const pa = Number(a.puntaje) || 0;
    const pb = Number(b.puntaje) || 0;
    return order === 'asc' ? pa - pb : pb - pa;
  });
}

export function saveProfileSnapshot(tipo, id, data) {
  sessionStorage.setItem(`profile_${tipo}_${id}`, JSON.stringify(data));
}

export function loadProfileSnapshot(tipo, id) {
  try {
    const raw = sessionStorage.getItem(`profile_${tipo}_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function profileUrl(tipo, id) {
  return `#/perfil/${tipo}/${id}`;
}

export function userNameLink(tipo, user, extra = '') {
  if (!user?.id) return '—';
  const nombre = user.nombre || `Usuario #${user.id}`;
  const puntaje = user.puntaje != null ? ` (${formatPuntaje(user.puntaje)})` : '';
  return `<a href="${profileUrl(tipo, user.id)}" class="profile-link" data-profile-tipo="${tipo}" data-profile-id="${user.id}">${nombre}${puntaje}</a>${extra}`;
}

export function bindProfileLinks(container) {
  container.querySelectorAll('.profile-link[data-profile-tipo]').forEach((el) => {
    el.addEventListener('click', () => {
      const holder = el.closest('[data-profile-data]');
      if (!holder?.dataset.profileData) return;
      try {
        const data = JSON.parse(holder.dataset.profileData);
        saveProfileSnapshot(el.dataset.profileTipo, el.dataset.profileId, data);
      } catch { /* ignore */ }
    });
  });
}
