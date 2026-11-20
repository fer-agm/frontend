// El backend usa nombres en español (codigo, nombre, precio...). El frontend conserva su modelo original
// (code, name, price...), por eso se traduce en un solo lugar.
export const toProduct = (p) => ({
  id: p.id,
  code: p.codigo,
  name: p.nombre,
  desc: p.descripcion ?? '',
  origin: p.origen ?? '',
  price: p.precio,
  offerPrice: p.precioOferta ?? undefined,
  stock: p.stock,
  image: p.imagen,
  category: p.categoria,
});

export const fromProduct = (p) => ({
  codigo: p.code,
  nombre: p.name,
  descripcion: p.desc,
  origen: p.origin,
  precio: p.price,
  precioOferta: p.offerPrice ?? null,
  stock: p.stock,
  imagen: p.image,
  categoria: p.category,
});

// Roles del frontend: 'admin' | 'vendedor' | 'cliente'
export const toUser = (u) => ({
  id: u.id,
  name: u.nombre,
  email: u.correo,
  age: u.edad,
  role: u.rol.toLowerCase(),
  points: u.puntos,
  isDuoc: u.duoc,
});

export const toOrder = (b) => ({
  id: b.numero,
  code: `ORDER${b.numero}`,
  date: b.fecha,
  status: b.estado === 'EXITOSA' ? 'success' : 'failed',
  userEmail: b.usuarioCorreo,
  customer: b.cliente,
  address: b.direccion,
  items: b.items.map((i) => ({ code: i.codigo, name: i.nombre, image: i.imagen, price: i.precio, qty: i.cantidad })),
  subtotal: b.subtotal,
  discount: b.descuento,
  tax: b.impuesto,
  total: b.total,
});
