import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function PerfilView() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cc: "",
    genero: "",
    direccion: "",
    fecha_nacimiento: "",
    preferencias_literarias: [],
  });

  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:8000/api/perfil/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setForm(res.data))
    .catch((err) => {
      console.error("Error al obtener el perfil:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const dataToSend = {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
    };

    try {
      await axios.put("http://localhost:8000/api/editar_perfil/", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Perfil actualizado correctamente.");
      setShowSuccessModal(true);
      setEditando(false);
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      setMensaje("Ocurrió un error al actualizar tu perfil.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="relative bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mi Perfil</h2>
        {!editando && (
          <button
            className="bg-[#5A4115] text-white px-4 py-2 rounded hover:bg-[#3e2f0d]"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        )}
      </div>

      <form onSubmit={handleGuardar} className="grid grid-cols-2 gap-4">
        <input name="nombre" className="px-4 py-2 border rounded w-full" placeholder="Nombre" value={form.nombre || ""} onChange={handleChange} readOnly={!editando} />
        <input name="apellido" className="px-4 py-2 border rounded w-full" placeholder="Apellido" value={form.apellido || ""} onChange={handleChange} readOnly={!editando} />
        <input name="email" className="px-4 py-2 border rounded w-full col-span-2" placeholder="Email" value={form.email || ""} onChange={handleChange} readOnly={!editando} />

        <input name="cc" className="px-4 py-2 border rounded w-full" placeholder="DNI" value={form.cc || ""} readOnly />
        <input name="genero" className="px-4 py-2 border rounded w-full" placeholder="Género" value={form.genero || ""} readOnly />
        <input name="fecha_nacimiento" type="date" className="px-4 py-2 border rounded w-full col-span-2" value={form.fecha_nacimiento || ""} readOnly />

        {editando && (
          <div className="col-span-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="px-4 py-2 border border-[#5A4115] rounded text-[#5A4115]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d]"
            >
              Guardar
            </button>
          </div>
        )}
      </form>



      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-green-600 mb-2">Éxito</h3>
            <p className="text-gray-700 mb-4">{mensaje}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Error */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
            <p className="text-gray-700 mb-4">{mensaje}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}