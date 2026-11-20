import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import RequireRole from './components/auth/RequireRole.jsx';
import AdminIndex from './pages/admin/AdminIndex.jsx';
import AdminProductoDetalle from './pages/admin/AdminProductoDetalle.jsx';

// Tienda
import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Categorias from './pages/Categorias.jsx';
import Ofertas from './pages/Ofertas.jsx';
import Carrito from './pages/Carrito.jsx';
import Checkout from './pages/Checkout.jsx';
import PagoCorrecto from './pages/PagoCorrecto.jsx';
import PagoError from './pages/PagoError.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogDetalle from './pages/BlogDetalle.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import InicioSesion from './pages/InicioSesion.jsx';
import RegistroUsuario from './pages/RegistroUsuario.jsx';

// Administrador
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminOrdenes from './pages/admin/AdminOrdenes.jsx';
import AdminBoleta from './pages/admin/AdminBoleta.jsx';
import AdminProductos from './pages/admin/AdminProductos.jsx';
import AdminProductosCriticos from './pages/admin/AdminProductosCriticos.jsx';
import AdminReporteProductos from './pages/admin/AdminReporteProductos.jsx';
import NuevoProducto from './pages/NuevoProducto.jsx';
import EditarProducto from './pages/EditarProducto.jsx';
import AdminCategorias from './pages/admin/AdminCategorias.jsx';
import AdminCategoriaForm from './pages/admin/AdminCategoriaForm.jsx';
import AdminUsuarios from './pages/admin/AdminUsuarios.jsx';
import NuevoUsuario from './pages/NuevoUsuario.jsx';
import EditarUsuario from './pages/EditarUsuario.jsx';
import AdminHistorialCompras from './pages/admin/AdminHistorialCompras.jsx';
import AdminReportes from './pages/admin/AdminReportes.jsx';
import AdminPerfil from './pages/admin/AdminPerfil.jsx';

const Admin = ({ children }) => <RequireRole roles={['admin']}>{children}</RequireRole>;
const Staff = ({ children }) => <RequireRole roles={['admin', 'vendedor']}>{children}</RequireRole>;
const Logged = ({ children }) => <RequireRole roles={['admin', 'vendedor', 'cliente']}>{children}</RequireRole>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/detalle-producto" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Logged><Checkout /></Logged>} />
        <Route path="/pago-correcto/:orderId" element={<Logged><PagoCorrecto /></Logged>} />
        <Route path="/pago-error/:orderId" element={<Logged><PagoError /></Logged>} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetalle />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="*" element={<Home />} />
      </Route>

      {/* Panel: ADMIN ve todo; VENDEDOR solo lista/detalle de productos y de órdenes (solo lectura) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminIndex />} />
        <Route path="ordenes" element={<Staff><AdminOrdenes /></Staff>} />
        <Route path="ordenes/:id" element={<Staff><AdminBoleta /></Staff>} />
        <Route path="productos" element={<Staff><AdminProductos /></Staff>} />
        <Route path="productos/detalle" element={<Staff><AdminProductoDetalle /></Staff>} />
        <Route path="productos/nuevo" element={<Admin><NuevoProducto /></Admin>} />
        <Route path="productos/editar" element={<Admin><EditarProducto /></Admin>} />
        <Route path="productos/criticos" element={<Admin><AdminProductosCriticos /></Admin>} />
        <Route path="productos/reportes" element={<Admin><AdminReporteProductos /></Admin>} />
        <Route path="categorias" element={<Admin><AdminCategorias /></Admin>} />
        <Route path="categorias/nueva" element={<Admin><AdminCategoriaForm /></Admin>} />
        <Route path="categorias/editar" element={<Admin><AdminCategoriaForm isEdit /></Admin>} />
        <Route path="usuarios" element={<Admin><AdminUsuarios /></Admin>} />
        <Route path="usuarios/nuevo" element={<Admin><NuevoUsuario /></Admin>} />
        <Route path="usuarios/editar" element={<Admin><EditarUsuario /></Admin>} />
        <Route path="usuarios/historial" element={<Admin><AdminHistorialCompras /></Admin>} />
        <Route path="reportes" element={<Admin><AdminReportes /></Admin>} />
        <Route path="perfil" element={<Admin><AdminPerfil /></Admin>} />
      </Route>
    </Routes>
  );
}
