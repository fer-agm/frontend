import { request, setToken, clearToken } from './http.js';
import { toProduct, fromProduct, toUser, toOrder } from './mappers.js';

const V1 = ''; // la versión (/api/v1) ya viene en API_URL

export const authApi = {
  async login(correo, password) {
    const data = await request(`${V1}/auth/login`, { method: 'POST', body: { correo, password } });
    setToken(data.token);
    return toUser(data.usuario);
  },
  async register({ name, email, password, age, refCode }) {
    const data = await request(`${V1}/auth/register`, {
      method: 'POST',
      body: { nombre: name, correo: email, password, edad: age, codigoReferido: refCode || null },
    });
    return toUser(data.usuario); // no se inicia sesión automáticamente (igual que antes)
  },
  async me() {
    return toUser(await request(`${V1}/auth/me`));
  },
  logout: clearToken,
};

export const productsApi = {
  list: async () => (await request('/productos')).map(toProduct),
  get: async (code) => toProduct(await request(`/productos/${encodeURIComponent(code)}`)),
  critical: async () => (await request('/productos/criticos')).map(toProduct),
  create: async (p) => toProduct(await request('/productos', { method: 'POST', body: fromProduct(p) })),
  update: async (p) => toProduct(await request(`/productos/${encodeURIComponent(p.code)}`, { method: 'PUT', body: fromProduct(p) })),
  remove: (code) => request(`/productos/${encodeURIComponent(code)}`, { method: 'DELETE' }),
};

// Las categorías se manejan por nombre en el frontend; la API las identifica por id.
export const categoriesApi = {
  listFull: () => request('/categorias'), // [{ id, nombre, cantidadProductos }]
  list: async () => (await request('/categorias')).map((c) => c.nombre),
  create: (nombre) => request('/categorias', { method: 'POST', body: { nombre } }),
  rename: (id, nombre) => request(`/categorias/${id}`, { method: 'PUT', body: { nombre } }),
  remove: (id) => request(`/categorias/${id}`, { method: 'DELETE' }),
};

const ROLE_TO_API = { admin: 'ADMIN', vendedor: 'VENDEDOR', cliente: 'CLIENTE' };
const userBody = (u) => ({
  nombre: u.name,
  correo: u.email,
  password: u.password || null,
  edad: u.age,
  rol: ROLE_TO_API[u.role] ?? 'CLIENTE',
  puntos: u.points ?? 0,
});

export const usersApi = {
  list: async () => (await request('/usuarios')).map(toUser),
  get: async (id) => toUser(await request(`/usuarios/${id}`)),
  create: async (u) => toUser(await request('/usuarios', { method: 'POST', body: userBody(u) })),
  update: async (id, u) => toUser(await request(`/usuarios/${id}`, { method: 'PUT', body: userBody(u) })),
  remove: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),
  updateProfile: async ({ name, age, currentPass, newPass }) =>
    toUser(await request('/usuarios/me', {
      method: 'PUT',
      body: { nombre: name, edad: age, passwordActual: currentPass || null, passwordNueva: newPass || null },
    })),
};

export const ordersApi = {
  list: async (email) => (await request(email ? `/boletas?correo=${encodeURIComponent(email)}` : '/boletas')).map(toOrder),
  mine: async () => (await request('/boletas/mias')).map(toOrder),
  get: async (numero) => toOrder(await request(`/boletas/${encodeURIComponent(numero)}`)),
  checkout: async ({ customer, address, items }) =>
    toOrder(await request('/boletas/checkout', {
      method: 'POST',
      body: { cliente: customer, direccion: address, items: items.map((i) => ({ codigo: i.code, cantidad: i.qty })) },
    })),
};
