// Cliente HTTP base (fetch). Agrega el token JWT y convierte los errores del backend en ApiError.
export const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:8080/api/v1';
export const TOKEN_KEY = 'lu_token';
export const UNAUTHORIZED_EVENT = 'lu:unauthorized';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(status, message, fieldErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors; // { campo: mensaje } cuando el backend valida el body
  }

  // Mensaje listo para mostrar al usuario
  get userMessage() {
    if (this.fieldErrors) return Object.values(this.fieldErrors).join('\n');
    return this.message;
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
  }

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* respuesta sin cuerpo JSON */
  }

  if (!res.ok) {
    // 401 con token guardado = sesión vencida o inválida (en el login no hay token, así que no aplica)
    if (res.status === 401 && token) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw new ApiError(res.status, data?.mensaje || `Error ${res.status}`, data?.errores || null);
  }
  return data;
}
