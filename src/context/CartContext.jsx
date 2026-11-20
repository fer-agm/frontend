import { createContext, useContext, useState } from 'react';
import { getCart, addToCart, updateCartQty, removeFromCart, clearCart } from '../utils/storage.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getCart());
  const sync = () => setItems(getCart());

  const value = {
    items,
    count: items.reduce((acc, i) => acc + i.qty, 0),
    subtotal: items.reduce((acc, i) => acc + i.price * i.qty, 0),
    // Recibe el producto (con su stock actual). El backend vuelve a validar stock y precio al pagar.
    add: (product, qty = 1) => {
      const name = addToCart(product, qty);
      if (name) alert(`${name} fue agregado al carrito de compras.`);
      else alert('No hay stock suficiente para agregar más unidades de este producto.');
      sync();
    },
    setQty: (code, qty) => { updateCartQty(code, qty); sync(); },
    remove: (code) => { removeFromCart(code); sync(); },
    clear: () => { clearCart(); sync(); },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
