import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import BookModal from "./BookModal";
import EjemplarModal from "./EjemplarModal";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [libros, setLibros] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const [verInactivos, setVerInactivos] = useState(false);
  const [mostrarModalEjemplar, setMostrarModalEjemplar] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");

    if (!stored) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(stored);
      if (user.rol?.toLowerCase() !== "administrador") {
        navigate("/");
      } else {
        setUsuario(user);
        cargarLibros();
      }
    } catch (err) {
      console.error("Error interpretando usuario:", err);
      navigate("/");
    }
  }, [navigate]);

  // 🔁 Recargar libros al cambiar el checkbox de "Ver eliminados"
  useEffect(() => {
    if (usuario) {
      cargarLibros();
    }
  }, [verInactivos]);

  const cargarLibros = () => {
    const estado = verInactivos ? "false" : "true";
    api
      .get(`libros/admin/?activo=${estado}`)
      .then((res) => setLibros(res.data))
      .catch((err) => console.error("Error cargando libros:", err));
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      api
        .delete(`libros/${id}/eliminar/`)
        .then(() => cargarLibros())
        .catch((err) => console.error("Error al eliminar libro:", err));
    }
  };

  const handleRestaurar = (id) => {
    api
      .put(`libros/${id}/restaurar/`)
      .then(() => cargarLibros())
      .catch((err) => console.error("Error al restaurar libro:", err));
  };

  const handleGuardarLibro = (libroGuardado) => {
    if (libroEditando) {
      setLibros((prev) =>
        prev.map((libro) =>
          libro.id === libroGuardado.id ? libroGuardado : libro
        )
      );
    } else {
      setLibros((prev) => [...prev, libroGuardado]);
    }
  };

  if (!usuario) return null;

  return (
    <div className="p-4 sm:p-8 max-w-[95vw] overflow-x-auto mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-[#5A4115]">
        Panel de Administración de Libros
      </h1>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setLibroEditando(null);
              setMostrarModal(true);
            }}
            className="px-4 py-2 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d]"
          >
            + Agregar libro
          </button>

          <button
            onClick={() => navigate("/mensajeria-admin")}
            className="px-4 py-2 border border-[#5A4115] text-[#5A4115] rounded hover:bg-[#f2e4cc]"
          >
            Foro de Mensajería
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm mt-2 sm:mt-0">
          <input
            type="checkbox"
            checked={verInactivos}
            onChange={() => setVerInactivos(!verInactivos)}
          />
          {verInactivos ? "Ver activos" : "Ver eliminados"}
        </label>
</div>

      <table className="min-w-full bg-white shadow rounded text-sm">
        <thead className="bg-[#dccdb4] text-[#5A4115]">
          <tr className="text-left">
            {["Título", "Autor", "Año", "Género", "Páginas", "Editorial", "ISSN", "Idioma", "Fecha Publicación", "Categoría", "Imagen", "Destacado", "Descripción", "Acciones"].map((col, i) => (
              <th key={i} className="px-3 py-2 whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id} className="border-b hover:bg-[#f9f5ef] text-sm text-gray-700">
              <td className="px-2 py-2">{libro.titulo}</td>
              <td className="px-2 py-2">{libro.autor}</td>
              <td className="px-2 py-2">{libro.anio_publicacion}</td>
              <td className="px-2 py-2">{libro.genero}</td>
              <td className="px-2 py-2">{libro.numero_paginas}</td>
              <td className="px-2 py-2">{libro.editorial}</td>
              <td className="px-2 py-2">{libro.issn}</td>
              <td className="px-2 py-2">{libro.idioma}</td>
              <td className="px-2 py-2">{libro.fecha_publicacion}</td>
              <td className="px-2 py-2">{libro.categoria}</td>
              <td className="px-2 py-2 truncate max-w-[120px]">{libro.imagen}</td>
              <td className="px-2 py-2">{libro.destacado ? "Sí" : "No"}</td>
              <td className="px-2 py-2 truncate max-w-[180px]">{libro.descripcion}</td>
              <td className="px-2 py-2 flex gap-2">
                {!verInactivos ? (
                  <>
                    <button
                      onClick={() => {
                        setLibroEditando(libro);
                        setMostrarModal(true);
                      }}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleEliminar(libro.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => {
                        setLibroSeleccionado(libro);
                        setMostrarModalEjemplar(true);
                      }}
                      className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      title="Agregar Ejemplar"
                    >
                      📚
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestaurar(libro.id)}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                    title="Restaurar"
                  >
                    <FaUndo />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <BookModal
          libro={libroEditando}
          onClose={() => setMostrarModal(false)}
          onSave={handleGuardarLibro}
        />
      )}

      {mostrarModalEjemplar && libroSeleccionado && (
        <EjemplarModal
          libroId={libroSeleccionado.id}
          onClose={() => {
            setMostrarModalEjemplar(false);
            setLibroSeleccionado(null);
            cargarLibros();
          }}
          onSave={() => {
            setMostrarModalEjemplar(false);
            setLibroSeleccionado(null);
            cargarLibros();
          }}
        />
      )}
    </div>
  );
}