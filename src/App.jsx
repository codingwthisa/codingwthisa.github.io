import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
// import Filtros from "./Components/Filtros";
import Login from "./Components/Login";
import Catalogo from "./Components/Catalogo";
import RegistroContainer from "./Components/RegistroContainer";
import ForgotPassword from "./Components/ForgotPassword";
import EditarPerfil from './Components/EditarPerfil';
import PerfilView from './Components/Perfil/PerfilView';
import Direcciones from './Components/Perfil/Direcciones';
import Pedidos from './Components/Perfil/Pedidos';
import TarjetasCredito from './Components/Perfil/TarjetasCredito';
import Inicio from "./Components/Inicio";
import AdminPanel from "./Components/AdminPanel";
import LibroDetalle from "./Components/LibroDetalle";
import ProductPage from "./Components/ProductPage";
import RootPage from "./Components/VistaRoot";
import AutorDetalle from "./Components/AutorDetalle";
import Mensajeria from "./Components/Mensajeria";
import MensajeriaAdmin from "./Components/MensajeriaAdmin";
import Carrito from "./Components/Carrito";
import Checkout from "./Components/Checkout";
import CarritoProvider from "./Components/CarritoContext";
import CheckoutCompletado from "./Components/CheckoutCompletado";
import Noticias from "./Components/Noticias";
import Reservas from "./Components/Perfil/Reservas";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <CarritoProvider>
    <Router>
      <Header />
      {/* <Filtros /> */}
      {/* Definir las rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/checkout/completado" element={<CheckoutCompletado />} />
        <Route path="/registro/*" element={<RegistroContainer />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/root" element={<RootPage />} />
        <Route path="/mensajeria" element={<Mensajeria />} />
        <Route path="/mensajeria-admin" element={<MensajeriaAdmin />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/libros/:id" element={<LibroDetalle />} />
        <Route path="/autores/:nombre" element={<AutorDetalle />} />
        <Route path="/catalogo/categoria/:categoria" element={<Catalogo />} />
        <Route path="/editar-perfil/*" element={<EditarPerfil />}>
          <Route path="reservas" element={<Reservas />} />
          <Route path="perfil" element={<PerfilView />} />
          <Route path="tarjetas" element={<TarjetasCredito />} />
          <Route path="direcciones" element={<Direcciones />} />
          <Route path="pedidos" element={<Pedidos />} />
        </Route>

      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
      {/* Footer */}
      <footer className="bg-[#5A4115] text-white text-sm mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Sobre nosotros */}
          <div>
            <h3 className="font-bold text-lg mb-2">HQlibrary</h3>
            <p>
              HQlibrary es tu librería online de confianza, ofreciendo novedades, clásicos y libros recomendados para todos los gustos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-2">Enlaces</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
              <li><a href="#" className="hover:underline">Política de privacidad</a></li>
              <li><a href="#" className="hover:underline">Política de devoluciones</a></li>
              <li><a href="#" className="hover:underline">Política de tratamiento de datos</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-2">Contacto</h3>
            <p>📍 Pereira, Colombia</p>
            <p>📞 +57 300 123 4567</p>
            <p>📧 contacto@hqlibrary.com</p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:underline">Facebook</a>
              <a href="#" className="hover:underline">Instagram</a>
              <a href="#" className="hover:underline">Twitter</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 text-center py-4 text-xs">
          © {new Date().getFullYear()} HQlibrary. Todos los derechos reservados.
        </div>
      </footer>
    </Router>
    </CarritoProvider>
  );
}

export default App;
