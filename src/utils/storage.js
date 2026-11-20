// Almacenamiento local del navegador: SOLO carrito y sesión.
// Productos, categorías, usuarios y órdenes viven en el backend (ver src/api).
import { getEffectivePrice } from './pricing.js';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Sesión (el token JWT se guarda aparte en api/http.js)
export const setCurrentUser = (user) => write('lu_session', user);
export const getCurrentUser = () => read('lu_session', null);
export const clearSession = () => {
  localStorage.removeItem('lu_session');
  localStorage.removeItem('lu_token');
};

// Carrito
export const getCart = () => read('lu_cart', []);

// Recibe el producto completo (ya cargado desde la API). Devuelve el nombre agregado o null si no hay stock.
export function addToCart(product, qty = 1) {
  if (!product) return null;
  const cart = getCart();
  const existing = cart.find((c) => c.code === product.code);
  const inCart = existing ? existing.qty : 0;
  if (product.stock !== undefined && inCart + qty > product.stock) return null;

  if (existing) existing.qty += qty;
  else cart.push({ ...product, price: getEffectivePrice(product), originalPrice: product.price, qty });
  write('lu_cart', cart);
  return product.name;
}
export function updateCartQty(code, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter((c) => c.code !== code);
  else {
    const item = cart.find((c) => c.code === code);
    if (item) item.qty = item.stock !== undefined ? Math.min(qty, item.stock) : qty;
  }
  write('lu_cart', cart);
}
export const removeFromCart = (code) => write('lu_cart', getCart().filter((c) => c.code !== code));
export const clearCart = () => write('lu_cart', []);
