import { useState, useEffect } from "react";
import axios from "axios";

const generosFiccion = [
  "Colombiana", "Cómics", "Crítica Literaria", "Fantástica y Ciencia Ficción",
  "Literatura Infantil", "Juvenil", "Latinoamericana", "Universal",
  "Novela Histórica", "Poesía", "Policíaca", "Romántica", "Suspenso y Terror"
];

const generosNoFiccion = [
  "Arte", "Autoayuda y Superación", "Biografías y Autobiografías",
  "Ciencias y Divulgación Científica", "Cine", "Diccionarios", "Espiritualidad",
  "Fotografía", "Gastronomía", "Música", "Teatro", "Administración",
  "Agricultura, Ganadería, Veterinaria", "Antropología", "Arquitectura",
  "Biología", "Comunicación y Periodismo", "Contabilidad", "Derecho",
  "Ecología y Medio Ambiente", "Economía", "Educación", "Feminismo",
  "Filosofía", "Finanzas", "Historia Colombiana", "Historia Latinoamericana",
  "Historia Universal", "Ingeniería", "Liderazgo", "Marketing y Publicidad",
  "Matemáticas", "Medicina Alternativa"
];

export default function BookModal({ libro, onClose, onSave }) {
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    anio_publicacion: "",
    genero: "",
    numero_paginas: "",
    editorial: "",
    issn: "",
    idioma: "",
    fecha_publicacion: "",
    categoria: "",
    imagen: "",
    destacado: false,
    descripcion: ""
  });

  useEffect(() => {
    if (libro) {
      setForm(libro);
    }
  }, [libro]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nuevoValor = type === "checkbox" ? checked : value;

    if (name === "genero") {
      if (generosFiccion.includes(value)) {
        setForm((prev) => ({
          ...prev,
          genero: value,
          categoria: "Ficción"
        }));
        return;
      } else if (generosNoFiccion.includes(value)) {
        setForm((prev) => ({
          ...prev,
          genero: value,
          categoria: "No Ficción"
        }));
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: nuevoValor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const camposPermitidos = [
      "titulo", "autor", "anio_publicacion", "genero", "numero_paginas",
      "editorial", "issn", "idioma", "fecha_publicacion", "categoria",
      "imagen", "destacado", "descripcion"
    ];

    const datosFiltrados = camposPermitidos.reduce((obj, campo) => {
      if (form[campo] !== undefined) obj[campo] = form[campo];
      return obj;
    }, {});

    console.log("📤 Enviando datos del libro:", datosFiltrados);

    const url = libro
      ? `http://localhost:8000/api/libros/${libro.id}/editar/`
      : "http://localhost:8000/api/libros/crear/";

    const method = libro ? "put" : "post";

    axios[method](url, datosFiltrados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        onSave(res.data);
        onClose();
      })
      .catch((err) => {
        console.error("Error al guardar libro:", err.response?.data || err.message);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-4xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4 text-[#5A4115]">
          {libro ? "Editar libro" : "Agregar nuevo libro"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            { name: "titulo", label: "Título" },
            { name: "autor", label: "Autor" },
            { name: "anio_publicacion", label: "Año de publicación", type: "number" },
            { name: "numero_paginas", label: "Número de páginas", type: "number" },
            { name: "editorial", label: "Editorial" },
            { name: "issn", label: "ISSN" },
            { name: "idioma", label: "Idioma" },
            { name: "fecha_publicacion", label: "Fecha de publicación", type: "date" },
            { name: "imagen", label: "URL de la imagen" },
          ].map(({ name, label, type = "text" }, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                className="px-3 py-2 border rounded w-full"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Género</label>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className="px-3 py-2 border rounded w-full"
              required
            >
              <option value="">Seleccione un género</option>
              <optgroup label="Ficción">
                {generosFiccion.map((gen, idx) => (
                  <option key={`fic-${idx}`} value={gen}>{gen}</option>
                ))}
              </optgroup>
              <optgroup label="No Ficción">
                {generosNoFiccion.map((gen, idx) => (
                  <option key={`nofic-${idx}`} value={gen}>{gen}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <input
              name="categoria"
              value={form.categoria}
              readOnly
              className="px-3 py-2 border rounded w-full bg-gray-100 text-gray-600"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="px-3 py-2 border rounded w-full"
            />
          </div>

          <div className="col-span-2 flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="destacado"
              checked={form.destacado}
              onChange={handleChange}
            />
            <label className="text-sm">Destacado</label>
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 rounded border border-[#5A4115] text-[#5A4115] hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#5A4115] text-white hover:bg-[#3e2f0d]"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
