// Roles del sistema y qué puede hacer cada uno
export const ROLES = { ADMIN: 'admin', VENDEDOR: 'vendedor', CLIENTE: 'cliente' };
export const ROLE_LABELS = { admin: 'Administrador', vendedor: 'Vendedor', cliente: 'Cliente' };

export const isStaff = (user) => !!user && (user.role === ROLES.ADMIN || user.role === ROLES.VENDEDOR);
export const isAdmin = (user) => !!user && user.role === ROLES.ADMIN;

// Página de inicio según el rol: el cliente solo usa la tienda; el vendedor entra directo a las órdenes
export const homeFor = (user) => (!user ? '/' : user.role === ROLES.ADMIN ? '/admin' : user.role === ROLES.VENDEDOR ? '/admin/ordenes' : '/');
