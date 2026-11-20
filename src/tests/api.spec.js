import { request, ApiError, setToken, clearToken, UNAUTHORIZED_EVENT } from '../api/http.js';
import { toProduct, fromProduct, toUser, toOrder } from '../api/mappers.js';
import { productsApi, authApi } from '../api/index.js';
import { jsonResponse } from './helpers.jsx';

describe('api (fetch + JWT)', () => {
  beforeEach(() => clearToken());

  describe('request', () => {
    it('envía el token JWT en el header Authorization cuando hay sesión', async () => {
      setToken('abc123');
      const spy = spyOn(window, 'fetch').and.callFake(() => jsonResponse([]));
      await request('/productos');
      expect(spy.calls.mostRecent().args[1].headers.Authorization).toBe('Bearer abc123');
    });

    it('no envía Authorization sin sesión y manda el body como JSON', async () => {
      const spy = spyOn(window, 'fetch').and.callFake(() => jsonResponse({}));
      await request('/auth/login', { method: 'POST', body: { correo: 'a@b.cl', password: 'x' } });
      const [, opts] = spy.calls.mostRecent().args;
      expect(opts.headers.Authorization).toBeUndefined();
      expect(opts.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(opts.body)).toEqual({ correo: 'a@b.cl', password: 'x' });
    });

    it('lanza ApiError con el mensaje y los errores de validación del backend', async () => {
      spyOn(window, 'fetch').and.callFake(() => jsonResponse({ mensaje: 'Datos inválidos', errores: { edad: 'Debes ser mayor de 18 años' } }, 400));
      try {
        await request('/auth/register', { method: 'POST', body: {} });
        fail('debió lanzar ApiError');
      } catch (e) {
        expect(e instanceof ApiError).toBeTrue();
        expect(e.status).toBe(400);
        expect(e.userMessage).toContain('Debes ser mayor de 18 años');
      }
    });

    it('con 401 y token guardado avisa que la sesión venció', async () => {
      setToken('vencido');
      const handler = jasmine.createSpy('unauthorized');
      window.addEventListener(UNAUTHORIZED_EVENT, handler);
      spyOn(window, 'fetch').and.callFake(() => jsonResponse({ mensaje: 'Debes iniciar sesión' }, 401));
      await request('/boletas').catch(() => {});
      window.removeEventListener(UNAUTHORIZED_EVENT, handler);
      expect(handler).toHaveBeenCalled();
    });

    it('responde con ApiError status 0 si no hay conexión con el servidor', async () => {
      spyOn(window, 'fetch').and.callFake(() => Promise.reject(new TypeError('Failed to fetch')));
      try {
        await request('/productos');
        fail('debió lanzar ApiError');
      } catch (e) {
        expect(e.status).toBe(0);
      }
    });

    it('devuelve null en una respuesta 204', async () => {
      spyOn(window, 'fetch').and.callFake(() => Promise.resolve(new Response(null, { status: 204 })));
      expect(await request('/productos/X', { method: 'DELETE' })).toBeNull();
    });
  });

  describe('mappers', () => {
    const api = { id: 1, codigo: 'JM001', nombre: 'Catan', descripcion: 'd', origen: 'o', precio: 100, precioOferta: 80, stock: 3, imagen: 'c.jpg', categoria: 'Juegos de Mesa' };

    it('traduce un producto del backend al modelo del frontend y viceversa', () => {
      const p = toProduct(api);
      expect(p).toEqual({ id: 1, code: 'JM001', name: 'Catan', desc: 'd', origin: 'o', price: 100, offerPrice: 80, stock: 3, image: 'c.jpg', category: 'Juegos de Mesa' });
      expect(fromProduct(p)).toEqual({ codigo: 'JM001', nombre: 'Catan', descripcion: 'd', origen: 'o', precio: 100, precioOferta: 80, stock: 3, imagen: 'c.jpg', categoria: 'Juegos de Mesa' });
    });

    it('un producto sin oferta no trae offerPrice', () => {
      expect(toProduct({ ...api, precioOferta: null }).offerPrice).toBeUndefined();
    });

    it('convierte el rol del backend a minúsculas', () => {
      expect(toUser({ id: 1, nombre: 'A', correo: 'a@b.cl', edad: 20, rol: 'VENDEDOR', puntos: 0, duoc: false }).role).toBe('vendedor');
    });

    it('traduce una boleta con IVA y estado', () => {
      const o = toOrder({
        numero: '2026111901', fecha: '2026-11-19T10:00:00', estado: 'FALLIDA', usuarioCorreo: 'a@b.cl',
        cliente: { nombre: 'A', apellidos: 'B', correo: 'a@b.cl' }, direccion: { calle: 'c', region: 'r', comuna: 'm' },
        items: [{ codigo: 'X', nombre: 'Prod', imagen: 'i.png', precio: 100, cantidad: 2, subtotal: 200 }],
        subtotal: 200, descuento: 0, impuesto: 38, total: 238,
      });
      expect(o.id).toBe('2026111901');
      expect(o.status).toBe('failed');
      expect(o.tax).toBe(38);
      expect(o.items[0]).toEqual({ code: 'X', name: 'Prod', image: 'i.png', price: 100, qty: 2 });
    });
  });

  describe('endpoints', () => {
    it('lista los productos desde GET /productos', async () => {
      const spy = spyOn(window, 'fetch').and.callFake(() => jsonResponse([{ id: 1, codigo: 'A', nombre: 'N', precio: 1, stock: 1, categoria: 'C' }]));
      const list = await productsApi.list();
      expect(spy.calls.mostRecent().args[0]).toContain('/productos');
      expect(list[0].code).toBe('A');
    });

    it('el login guarda el token JWT recibido', async () => {
      spyOn(window, 'fetch').and.callFake(() => jsonResponse({ token: 'jwt-123', usuario: { id: 1, nombre: 'A', correo: 'a@b.cl', edad: 20, rol: 'ADMIN', puntos: 0, duoc: false } }));
      const user = await authApi.login('a@b.cl', 'x');
      expect(user.role).toBe('admin');
      expect(localStorage.getItem('lu_token')).toBe('jwt-123');
    });
  });
});
