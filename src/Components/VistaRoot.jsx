import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Pencil, Trash2 } from "lucide-react";

export default function RootPage() {
  const navigate = useNavigate();
  const [seleccionados, setSeleccionados] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [adminEditarId, setAdminEditarId] = useState(null);
  const [nuevoAdmin, setNuevoAdmin] = useState({ nombre: "", email: "", fecha: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");

    if (!stored) {
      navigate("/");
      return;
    }

    try {
      const user = JSON.parse(stored);
      if (user.rol !== "root") {
        navigate("/");
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error interpretando usuario:", err);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!loading) {
      api.get("administradores/")
        .then((res) => setAdministradores(res.data))
        .catch((err) => console.error("Error al cargar administradores:", err));
    }
  }, [loading]);

  if (loading) return null;

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleTodos = () => {
    if (seleccionados.length === administradores.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(administradores.map((a) => a.id));
    }
  };

  const handleAgregarAdmin = () => {
    const { nombre, email, fecha } = nuevoAdmin;

    if (modoEdicion) {
      api.put(`administradores/${adminEditarId}/`, { nombre, email, fecha })
        .then(() => {
          setAdministradores((prev) =>
            prev.map((admin) =>
              admin.id === adminEditarId ? { ...admin, nombre, email, fecha } : admin
            )
          );
          resetModal();
        })
        .catch((err) => {
          console.error("Error al editar administrador:", err);
          alert("Error al editar administrador.");
        });
    } else {
      api.post("registrar_administrador/", {
        nombre,
        email,
        rol: "administrador",
        password: "admin123",
        fecha,
      })
        .then((res) => {
          setAdministradores([...administradores, res.data]);
          resetModal();
        })
        .catch((err) => {
          console.error("Error al registrar administrador:", err);
          alert("Error al registrar administrador.");
        });
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setAdminEditarId(null);
    setNuevoAdmin({ nombre: "", email: "", fecha: "" });
  };

  const handleEditar = (admin) => {
    setNuevoAdmin({ nombre: admin.nombre, email: admin.email, fecha: admin.fecha });
    setModoEdicion(true);
    setAdminEditarId(admin.id);
    setShowModal(true);
  };

  const handleEliminar = () => {
    Promise.all(
      seleccionados.map((id) => api.delete(`administradores/${id}/`))
    )
      .then(() => {
        setAdministradores(administradores.filter((a) => !seleccionados.includes(a.id)));
        setSeleccionados([]);
        setShowConfirmacion(false);
      })
      .catch((err) => {
        console.error("Error al eliminar:", err);
        alert("Error al eliminar administradores.");
      });
  };

  const seleccionadosDetalles = administradores.filter((admin) =>
    seleccionados.includes(admin.id)
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10" style={{ backgroundColor: "#FDFBF8" }}>
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-300">
        <div className="p-4 flex flex-col lg:flex-row justify-between gap-4 border-b border-gray-200" style={{ backgroundColor: "#DACCB2" }}>
          <h1 className="text-xl font-semibold text-gray-800">Administradores</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-xl transition shadow"
            style={{ backgroundColor: "#604719" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m6-3H6" />
            </svg>
            Nuevo Administrador
          </button>
        </div>

        {seleccionados.length > 0 && (
          <div className="px-4 py-3 text-sm flex items-center justify-between rounded-b-xl shadow" style={{ backgroundColor: "#F3E9DC", color: "#4B3F2F", borderBottom: "2px solid #D8C3A5" }}>
            <span className="font-medium">{seleccionados.length} seleccionados</span>
            <button onClick={() => setShowConfirmacion(true)} style={{ backgroundColor: "#876A33" }} className="px-3 py-1 text-xs text-white rounded-xl transition">Eliminar</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead style={{ backgroundColor: "#FDFBF8" }} className="text-left text-xs font-semibold text-[#4B3F2F]">
              <tr>
                <th className="p-3">
                  <input type="checkbox" checked={seleccionados.length === administradores.length} onChange={toggleTodos} className="form-checkbox text-black" />
                </th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Fecha creación</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {administradores.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-100">
                  <td className="p-3">
                    <input type="checkbox" checked={seleccionados.includes(admin.id)} onChange={() => toggleSeleccion(admin.id)} className="form-checkbox text-black" />
                  </td>
                  <td className="p-3 font-medium text-gray-800">{admin.nombre}</td>
                  <td className="p-3 text-gray-700">{admin.email}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: "#B89B74", color: "#FDFBF8" }}>Administrador</span>
                  </td>
                  <td className="p-3 text-gray-700">{admin.fecha}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEditar(admin)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => { setSeleccionados([admin.id]); setShowConfirmacion(true); }}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800">
              {modoEdicion ? "Editar administrador" : "Nuevo administrador"}
            </h2>
            <input type="text" placeholder="Nombre" value={nuevoAdmin.nombre} onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={nuevoAdmin.email} onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })} className="w-full p-2 border rounded" />
            <input type="date" placeholder="Fecha de creación" value={nuevoAdmin.fecha} onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, fecha: e.target.value })} className="w-full p-2 border rounded" />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={resetModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleAgregarAdmin} className="px-4 py-2 text-white rounded" style={{ backgroundColor: "#604719" }}>
                {modoEdicion ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {showConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Seguro que deseas eliminar?</h3>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              {seleccionadosDetalles.map((admin) => (
                <li key={admin.id}>
                  • {admin.nombre} ({admin.email})
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirmacion(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={handleEliminar} className="px-4 py-2 text-white rounded" style={{ backgroundColor: "#604719" }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}