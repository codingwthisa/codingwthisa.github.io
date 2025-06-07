import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditarPerfil() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mostrarNoticias, setMostrarNoticias] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user || user.rol?.toLowerCase() !== "cliente") {
      navigate("/login");
    } else {
      setMostrarNoticias(user.recibir_noticias === true);
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-[#f8f6f0]">
      {/* Sidebar de navegación */}
      <aside className="bg-[#E5D6B8] w-64 p-6 flex flex-col gap-4 shadow-lg">
        <h2 className="text-xl font-semibold text-[#5A4115] mb-4">Mi Perfil</h2>
        <nav className="flex flex-col gap-2 text-[#5A4115] font-medium">
          <Link
            to="/editar-perfil/perfil"
            className={`hover:bg-white px-4 py-2 rounded ${
              location.pathname === "/editar-perfil/perfil" ? "bg-white font-semibold" : ""
            }`}
          >
            Perfil
          </Link>
          <Link
            to="/editar-perfil/tarjetas"
            className={`hover:bg-white px-4 py-2 rounded ${
              location.pathname === "/editar-perfil/tarjetas" ? "bg-white font-semibold" : ""
            }`}
          >
            Tarjetas
          </Link>
          <Link
            to="/editar-perfil/direcciones"
            className={`hover:bg-white px-4 py-2 rounded ${
              location.pathname === "/editar-perfil/direcciones" ? "bg-white font-semibold" : ""
            }`}
          >
            Direcciones
          </Link>
          <Link
            to="/editar-perfil/pedidos"
            className={`hover:bg-white px-4 py-2 rounded ${
              location.pathname === "/editar-perfil/pedidos" ? "bg-white font-semibold" : ""
            }`}
          >
            Pedidos
          </Link>
          
          <Link
            to="/editar-perfil/reservas"
            className={`hover:bg-white px-4 py-2 rounded ${
              location.pathname === "/editar-perfil/reservas" ? "bg-white font-semibold" : ""
            }`}
          >
            Reservas
          </Link>
          {mostrarNoticias && (
            <Link
              to="/noticias"
              className={`hover:bg-white px-4 py-2 rounded ${
                location.pathname === "/noticias" ? "bg-white font-semibold" : ""
              }`}
            >
              Noticias
            </Link>
          )}
        </nav>
      </aside>

      {/* Contenido dinámico */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}