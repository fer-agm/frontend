import { fireEvent, screen, waitFor } from '@testing-library/react';
import { addToCart } from '../utils/storage.js';
import { resetStorage, loginAsCliente, renderApp, jsonResponse, PRODUCTS } from './helpers.jsx';

const order = (estado) => ({
  numero: '2026111901', fecha: '2026-11-19T10:00:00', estado, usuarioCorreo: 'cliente@levelup.cl',
  cliente: { nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@levelup.cl' },
  direccion: { calle: 'Calle 1', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', indicaciones: '' },
  items: [{ codigo: 'AC001', nombre: PRODUCTS.AC001.name, imagen: 'p.jpg', precio: 59990, cantidad: 1, subtotal: 59990 }],
  subtotal: 59990, descuento: 0, impuesto: 11398, total: 71388,
});

describe('flujo de compra', () => {
  beforeEach(() => {
    resetStorage();
    spyOn(window, 'alert');
  });

  it('el carrito detalla subtotal, IVA (19%) y total', () => {
    addToCart(PRODUCTS.AC001);
    renderApp('/carrito');
    expect(document.body.textContent).toContain('Subtotal: $59.990 CLP');
    expect(document.body.textContent).toContain('IVA (19%): $11.398 CLP');
    expect(document.body.textContent).toContain('$71.388 CLP');
  });

  it('un invitado que pulsa "Ir a pagar" es enviado a iniciar sesión', async () => {
    addToCart(PRODUCTS.AC001);
    renderApp('/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Ir a pagar' }));
    await waitFor(() => expect(screen.getByText('Iniciar Sesión', { selector: 'h2' })).toBeTruthy());
  });

  it('el checkout pide los datos del cliente y la dirección de entrega', () => {
    loginAsCliente();
    spyOn(window, 'fetch').and.callFake(() => jsonResponse({}));
    addToCart(PRODUCTS.AC001);
    renderApp('/checkout');
    expect(screen.getByLabelText('Nombre *')).toBeTruthy();
    expect(screen.getByLabelText('Región *')).toBeTruthy();
    expect(screen.getByLabelText('Comuna *')).toBeTruthy();
    expect(document.body.textContent).toContain('IVA (19%)');
  });

  it('muestra la vista de compra exitosa', async () => {
    loginAsCliente();
    spyOn(window, 'fetch').and.callFake(() => jsonResponse(order('EXITOSA')));
    renderApp('/pago-correcto/2026111901');
    await waitFor(() => expect(document.body.textContent).toContain('Se ha realizado la compra'));
    expect(document.body.textContent).toContain('IVA (19%): $11.398 CLP');
    expect(document.body.textContent).toContain('Total pagado: $71.388 CLP');
  });

  it('muestra la vista de compra fallida con la opción de reintentar', async () => {
    loginAsCliente();
    spyOn(window, 'fetch').and.callFake(() => jsonResponse(order('FALLIDA')));
    renderApp('/pago-error/2026111901');
    await waitFor(() => expect(document.body.textContent).toContain('No se pudo realizar el pago'));
    expect(screen.getByRole('button', { name: 'VOLVER A REALIZAR EL PAGO' })).toBeTruthy();
  });

  it('la vista de compra exitosa no se muestra para una orden fallida', async () => {
    loginAsCliente();
    spyOn(window, 'fetch').and.callFake(() => jsonResponse(order('FALLIDA')));
    renderApp('/pago-correcto/2026111901');
    await waitFor(() => expect(document.body.textContent).toContain('No se encontró la orden'));
  });
});
