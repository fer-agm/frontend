import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider, useCart } from '../context/CartContext.jsx';
import { setCurrentUser } from '../utils/storage.js';
import { TOKEN_KEY } from '../api/http.js';

// Datos de ejemplo (los reales vienen del backend)
export const USERS = {
  admin: { id: 1, name: 'Administrador Principal', email: 'admin@levelup.cl', age: 30, role: 'admin', points: 1000, isDuoc: false },
  vendedor: { id: 2, name: 'Vendedor Demo', email: 'vendedor@levelup.cl', age: 28, role: 'vendedor', points: 0, isDuoc: false },
  cliente: { id: 3, name: 'Cliente Demo', email: 'cliente@levelup.cl', age: 25, role: 'cliente', points: 0, isDuoc: false },
  duoc: { id: 4, name: 'Estudiante Duoc', email: 'estudiante@duoc.cl', age: 21, role: 'cliente', points: 100, isDuoc: true },
};

export const PRODUCTS = {
  AC001: { id: 3, code: 'AC001', category: 'Accesorios', name: 'Controlador Inalámbrico Xbox Series X', price: 59990, origin: 'Microsoft', desc: 'Ofrece una experiencia de juego cómoda con botones mapeables.', image: 'placeholder.jpg', stock: 25 },
  JM001: { id: 1, code: 'JM001', category: 'Juegos de Mesa', name: 'Catan', price: 29990, offerPrice: 24990, origin: 'Devir', desc: 'Juego de estrategia.', image: 'catan.jpg', stock: 12 },
};

// Deja localStorage como una instalación nueva (sin sesión ni carrito)
export function resetStorage() {
  localStorage.clear();
}

// Simula una sesión iniciada (el token solo necesita existir: no se valida en el navegador)
export function loginAs(user) {
  localStorage.setItem(TOKEN_KEY, 'token-de-prueba');
  setCurrentUser(user);
}
export const loginAsAdmin = () => loginAs(USERS.admin);
export const loginAsVendedor = () => loginAs(USERS.vendedor);
export const loginAsCliente = () => loginAs(USERS.cliente);
export const loginAsDuoc = () => loginAs(USERS.duoc);

// Respuesta JSON falsa para spyOn(window, 'fetch')
export const jsonResponse = (body, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));

// Renderiza un componente con Router, sesión y carrito (igual que en la app real)
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

// Renderiza toda la aplicación (rutas incluidas) partiendo en `route`
export const renderApp = (route = '/') => renderWithProviders(<App />, { route });

// Componente auxiliar que expone el estado del carrito en el DOM
export function CartProbe() {
  const { count, subtotal } = useCart();
  return <div data-testid="cart-probe">{count}|{subtotal}</div>;
}
