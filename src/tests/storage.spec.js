import { getCart, addToCart, updateCartQty, removeFromCart, clearCart, setCurrentUser, getCurrentUser, clearSession } from '../utils/storage.js';
import { resetStorage, PRODUCTS, USERS } from './helpers.jsx';

describe('storage (carrito y sesión en localStorage)', () => {
  beforeEach(() => resetStorage());

  describe('carrito', () => {
    it('empieza vacío', () => {
      expect(getCart()).toEqual([]);
    });

    it('agrega un producto usando su precio efectivo (oferta)', () => {
      expect(addToCart(PRODUCTS.JM001)).toBe('Catan');
      const [item] = getCart();
      expect(item.code).toBe('JM001');
      expect(item.price).toBe(24990);
      expect(item.originalPrice).toBe(29990);
      expect(item.qty).toBe(1);
    });

    it('suma la cantidad si el producto ya estaba en el carrito', () => {
      addToCart(PRODUCTS.AC001);
      addToCart(PRODUCTS.AC001, 2);
      expect(getCart()[0].qty).toBe(3);
    });

    it('no permite superar el stock disponible', () => {
      expect(addToCart({ ...PRODUCTS.AC001, stock: 2 }, 3)).toBeNull();
      expect(getCart()).toEqual([]);
    });

    it('ignora un producto indefinido', () => {
      expect(addToCart(undefined)).toBeNull();
    });

    it('actualiza la cantidad respetando el stock y elimina con cantidad 0', () => {
      addToCart(PRODUCTS.AC001);
      updateCartQty('AC001', 5);
      expect(getCart()[0].qty).toBe(5);
      updateCartQty('AC001', 999);
      expect(getCart()[0].qty).toBe(PRODUCTS.AC001.stock);
      updateCartQty('AC001', 0);
      expect(getCart()).toEqual([]);
    });

    it('quita un producto y vacía el carrito', () => {
      addToCart(PRODUCTS.AC001);
      addToCart(PRODUCTS.JM001);
      removeFromCart('AC001');
      expect(getCart().map((c) => c.code)).toEqual(['JM001']);
      clearCart();
      expect(getCart()).toEqual([]);
    });
  });

  describe('sesión', () => {
    it('guarda y lee el usuario actual', () => {
      setCurrentUser(USERS.admin);
      expect(getCurrentUser().email).toBe('admin@levelup.cl');
    });

    it('al cerrar sesión borra el usuario y el token', () => {
      localStorage.setItem('lu_token', 'x');
      setCurrentUser(USERS.admin);
      clearSession();
      expect(getCurrentUser()).toBeNull();
      expect(localStorage.getItem('lu_token')).toBeNull();
    });
  });
});
