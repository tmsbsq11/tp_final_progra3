import { API_BASE } from './config.js';
import { getToken } from './auth.js';
import { showToast } from './ui.js';

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request(path, options = {}) {
  const { method = 'GET', body, auth = true, silent = false } = options;
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith('/api') ? path : `${API_BASE}${path}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const data = await parseBody(response);

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || `Error ${response.status}`;
    if (!silent) showToast(message, 'error');
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function adminRequest(path, options = {}) {
  const { method = 'GET', body, auth = true, silent = false } = options;
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith('/admin') ? path : `/admin${path}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const data = await parseBody(response);

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || `Error ${response.status}`;
    if (!silent) showToast(message, 'error');
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function toLocalDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocal(value) {
  if (!value) return null;
  return value.length === 16 ? `${value}:00` : value;
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('es-AR');
}
