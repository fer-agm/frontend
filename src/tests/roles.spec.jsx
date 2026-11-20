import { screen, waitFor } from '@testing-library/react';
import { isStaff, isAdmin, homeFor } from '../utils/roles.js';
import { resetStorage, loginAsAdmin, loginAsVendedor, loginAsCliente, renderApp, jsonResponse, USERS, PRODUCTS } from './helpers.jsx';

describe('roles y permisos', () => {
  beforeEach(() => {
    resetStorage();
    spyOn(window, 'alert');
  });

  describe('utils/roles', () => {
    it('solo ADMIN y VENDEDOR son personal del panel', () => {
      expect(isStaff(USERS.admin)).toBeTrue();
      expect(isStaff(USERS.vendedor)).toBeTrue();
      expect(isStaff(USERS.cliente)).toBeFalse();
      expect(isStaff(null)).toBeFalse();
    });

    it('solo ADMIN es administrador', () => {
      expect(isAdmin(USERS.admin)).toBeTrue();
      expect(isAdmin(USERS.vendedor)).toBeFalse();
    });

    it('cada rol parte en su página', () => {
      expect(homeFor(USERS.admin)).toBe('/admin');
      expect(homeFor(USERS.vendedor)).toBe('/admin/ordenes');
      expect(homeFor(USERS.cliente)).toBe('/');
      expect(homeFor(null)).toBe('/');
    });
  });

  describe('rutas protegidas', () => {
    beforeEach(() => {
      // El panel carga datos al entrar: se responden listas vacías / el producto de ejemplo
      spyOn(window, 'fetch').and.callFake((url) => {
        if (String(url).includes('/auth/me')) return jsonResponse({ id: 1, nombre: 'X', correo: 'x@x.cl', edad: 20, rol: 'ADMIN', puntos: 0, duoc: false });
        return jsonResponse([]);
      });
    });

    it('un invitado que entra a /admin/ordenes es enviado al login', async () => {
      renderApp('/admin/ordenes');
      await waitFor(() => expect(screen.getByText('Iniciar Sesión', { selector: 'h2' })).toBeTruthy());
    });

    it('un cliente no puede abrir el panel de administración', async () => {
      loginAsCliente();
      renderApp('/admin/usuarios');
      await waitFor(() => expect(window.alert).toHaveBeenCalled()); // AdminLayout: acceso restringido
      expect(screen.queryByText('Gestión de Usuarios')).toBeNull();
    });

    it('un invitado no puede entrar al checkout', async () => {
      renderApp('/checkout');
      await waitFor(() => expect(screen.getByText('Iniciar Sesión', { selector: 'h2' })).toBeTruthy());
    });
  });

  describe('panel del vendedor', () => {
    beforeEach(() => {
      spyOn(window, 'fetch').and.callFake((url) => {
        const u = String(url);
        if (u.includes('/auth/me')) return jsonResponse({ id: 2, nombre: 'Vendedor Demo', correo: 'vendedor@levelup.cl', edad: 28, rol: 'VENDEDOR', puntos: 0, duoc: false });
        if (u.includes('/productos')) {
          return jsonResponse([{ id: 3, codigo: 'AC001', nombre: PRODUCTS.AC001.name, descripcion: 'd', origen: 'o', precio: 59990, precioOferta: null, stock: 25, imagen: 'p.jpg', categoria: 'Accesorios' }]);
        }
        return jsonResponse([]);
      });
    });

    it('el menú solo muestra Órdenes y Productos', async () => {
      loginAsVendedor();
      renderApp('/admin/ordenes');
      await waitFor(() => expect(screen.getByText(/Órdenes \/ Boletas/)).toBeTruthy());
      const sidebar = document.querySelector('aside');
      expect(sidebar.textContent).toContain('Órdenes');
      expect(sidebar.textContent).toContain('Productos');
      ['Dashboard', 'Categorías', 'Usuarios', 'Reportes', 'Perfil'].forEach((t) => expect(sidebar.textContent).not.toContain(t));
    });

    it('la lista de productos es de solo lectura: tiene "Ver detalle" pero no crear/editar/eliminar', async () => {
      loginAsVendedor();
      renderApp('/admin/productos');
      await waitFor(() => expect(screen.getByText('Ver detalle')).toBeTruthy());
      expect(screen.queryByText('+ Nuevo Producto')).toBeNull();
      expect(screen.queryByText('Editar')).toBeNull();
      expect(screen.queryByText('Eliminar')).toBeNull();
    });

    it('si el vendedor intenta abrir una pantalla de administrador vuelve a sus órdenes', async () => {
      loginAsVendedor();
      renderApp('/admin/usuarios');
      await waitFor(() => expect(screen.getByText(/Órdenes \/ Boletas/)).toBeTruthy());
      expect(screen.queryByText('Gestión de Usuarios')).toBeNull();
    });
  });

  describe('panel del administrador', () => {
    it('ve el menú completo y puede crear productos', async () => {
      spyOn(window, 'fetch').and.callFake((url) => {
        const u = String(url);
        if (u.includes('/auth/me')) return jsonResponse({ id: 1, nombre: 'Administrador Principal', correo: 'admin@levelup.cl', edad: 30, rol: 'ADMIN', puntos: 1000, duoc: false });
        return jsonResponse([]);
      });
      loginAsAdmin();
      renderApp('/admin/productos');
      await waitFor(() => expect(screen.getByText('+ Nuevo Producto')).toBeTruthy());
      const sidebar = document.querySelector('aside');
      ['Dashboard', 'Órdenes', 'Productos', 'Categorías', 'Usuarios', 'Reportes', 'Perfil'].forEach((t) => expect(sidebar.textContent).toContain(t));
    });
  });
});
