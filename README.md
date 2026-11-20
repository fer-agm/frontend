# Level-Up Gamer — Frontend (React + Vite)

Tienda online conectada por `fetch` al backend Spring Boot (`../backend`), con autenticación JWT y roles.

## Ejecutar
```bash
# 1) Backend (otra terminal): ver ../backend/README.md  -> http://localhost:8080
# 2) Frontend
npm install --legacy-peer-deps
npm run dev            # http://localhost:5173
```
La URL del API se cambia en `.env` (`VITE_API_URL`, ver `.env.example`).

## Roles
| Rol | Qué ve |
|---|---|
| **Administrador** | Todo: dashboard, órdenes, productos (CRUD), categorías, usuarios, reportes, perfil |
| **Vendedor** | Solo lista y detalle de **productos** y de **órdenes** (solo lectura). El resto del menú no aparece |
| **Cliente** | Solo la tienda (catálogo, carrito, checkout, compras) |

Usuarios de prueba: `admin@levelup.cl / admin`, `vendedor@levelup.cl / vendedor`, `cliente@levelup.cl / cliente`, `estudiante@duoc.cl / 123` (20% Duoc).

## Vistas de compra
- **Carrito** (`/carrito`): detalle con subtotal, descuento Duoc, **IVA 19%** y total.
- **Checkout** (`/checkout`): datos del cliente y dirección de entrega (requiere sesión).
- **Compra exitosa** (`/pago-correcto/:n`) y **Compra fallida** (`/pago-error/:n`, con botón para reintentar).

## Estructura relevante
- `src/api/` cliente HTTP (`http.js`), traductores backend↔frontend (`mappers.js`) y endpoints (`index.js`).
- `src/components/auth/RequireRole.jsx` protege rutas por rol; `src/utils/roles.js` define los roles.
- `src/utils/storage.js` ahora guarda solo carrito y sesión (el resto vive en la base de datos).

## Pruebas
`npm test` (Karma + Jasmine, requiere Chrome). Las pruebas que dependían de localStorage como base de datos se reemplazaron por `api.spec`, `roles.spec` y `checkout.spec`.
