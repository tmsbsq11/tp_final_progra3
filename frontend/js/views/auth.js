import { login, register } from '../auth.js';
import { showToast, setLoading } from '../ui.js';
import { DEFAULT_ROUTE } from '../config.js';

let bound = false;

export function initAuthViews() {
  if (bound) return;
  bound = true;

  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setLoading(true);
    try {
      const profile = await login(fd.get('correo'), fd.get('password'));
      showToast(`Bienvenido, ${profile.nombre}`, 'success');
      location.hash = DEFAULT_ROUTE[profile.rol] || '#/login';
    } catch (err) {
      showToast(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  });

  document.getElementById('form-register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setLoading(true);
    try {
      await register({
        nombre: fd.get('nombre'),
        correo: fd.get('correo'),
        password: fd.get('password'),
        rol: fd.get('rol'),
      });
      showToast('Cuenta creada. Ya podés iniciar sesión.', 'success');
      location.hash = '#/login';
    } catch (err) {
      showToast(err.message || 'Error al registrarse', 'error');
    } finally {
      setLoading(false);
    }
  });
}

export async function renderLogin() {}
export async function renderRegister() {}
