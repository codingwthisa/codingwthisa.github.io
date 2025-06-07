import React, { useState, useEffect } from "react";
import api from "../../api";

export default function Direcciones() {
  const [form, setForm] = useState({
    direccion: "",
    detalle: "",
    pais: "",
    departamento: "",
    ciudad: "",
    codigo_postal: "",
  });

  const [direcciones, setDirecciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // GET de direcciones existentes
  useEffect(() => {
    api.get("direcciones/")
      .then(res => setDirecciones(res.data))
      .catch(() => setError("Error al cargar direcciones."));
  }, []);

  // Cargar países al inicio
  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
        const data = await res.json();
        const listaPaises = data.data.map(p => p.name).sort();
        setPaises(listaPaises);
      } catch (err) {
        console.error("Error al obtener países", err);
      }
    };
    fetchPaises();
  }, []);

  // Cargar departamentos cuando cambia el país
  useEffect(() => {
    if (!form.pais) return;

    const fetchDepartamentos = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: form.pais }),
        });
        const data = await res.json();

        const limpiar = (n) =>
          n.replace(/ department| state| province| territory/i, "").trim();

        const estados = data.data.states.map((s) => ({
          value: s.name,
          label: limpiar(s.name),
        }));
        setDepartamentos(estados.sort((a, b) => a.label.localeCompare(b.label)));
        setForm((f) => ({ ...f, departamento: "", ciudad: "" }));
        setCiudades([]);
      } catch (err) {
        console.error("Error al obtener departamentos", err);
      }
    };
    fetchDepartamentos();
  }, [form.pais]);

  // Cargar ciudades cuando cambia el departamento
  useEffect(() => {
    if (!form.pais || !form.departamento) return;

    const fetchCiudades = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: form.pais,
            state: form.departamento,
          }),
        });

        const data = await res.json();
        const lista = Array.isArray(data.data)
          ? [...new Set(data.data.filter(c => typeof c === "string" && c.trim()))]
          : [];

        setCiudades(lista.sort((a, b) => a.localeCompare(b)));
        setForm((f) => ({ ...f, ciudad: "" }));
      } catch (err) {
        console.error("Error al obtener ciudades", err);
        setCiudades([]);
      }
    };
    fetchCiudades();
  }, [form.pais, form.departamento]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    api.post("direcciones/agregar/", form)
      .then(() => {
        setForm({
          direccion: "",
          detalle: "",
          pais: "",
          departamento: "",
          ciudad: "",
          codigo_postal: "",
        });
        setMostrarFormulario(false);
        setMensaje("Dirección registrada correctamente.");
        return api.get("direcciones/");
      })
      .then(res => setDirecciones(res.data))
      .catch(() => setError("Error al registrar dirección."));
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Eliminar esta dirección?")) {
      api.delete(`direcciones/${id}/eliminar/`)
        .then(() => {
          setMensaje("Dirección eliminada.");
          return api.get("direcciones/");
        })
        .then(res => setDirecciones(res.data))
        .catch(() => setError("No se pudo eliminar la dirección."));
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#5A4115]">Mis direcciones</h2>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#5A4115] text-white px-4 py-2 rounded hover:bg-[#3e2f0d] text-sm"
        >
          {mostrarFormulario ? "Cancelar" : "Añadir nueva dirección"}
        </button>
      </div>

      {mensaje && <p className="text-green-600 mb-2 text-sm">{mensaje}</p>}
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      {mostrarFormulario && (
        <form onSubmit={handleAgregar} className="grid grid-cols-1 gap-4 mb-6">
          <input
            name="direccion"
            placeholder="Dirección principal"
            value={form.direccion}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="detalle"
            placeholder="Detalle (edificio, torre, etc.)"
            value={form.detalle}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <select name="pais" value={form.pais} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Selecciona un país</option>
            {paises.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select name="departamento" value={form.departamento} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Selecciona un departamento</option>
            {departamentos.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <select name="ciudad" value={form.ciudad} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Selecciona una ciudad</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            name="codigo_postal"
            placeholder="Código Postal"
            value={form.codigo_postal}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="bg-[#5A4115] text-white px-4 py-2 rounded w-fit self-end"
          >
            Guardar dirección
          </button>
        </form>
      )}

      <h3 className="text-lg font-bold text-[#5A4115] mb-4">Direcciones registradas</h3>
      {direcciones.length === 0 ? (
        <p className="text-gray-500">Aún no tienes direcciones guardadas.</p>
      ) : (
        <ul className="space-y-4">
          {direcciones.map((dir) => (
            <li key={dir.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{dir.direccion}</p>
                  {dir.detalle && <p className="text-sm">{dir.detalle}</p>}
                  <p className="text-sm">{dir.departamento}, {dir.ciudad}, {dir.pais}</p>
                  <p className="text-sm">Código Postal: {dir.codigo_postal}</p>
                </div>
                <button
                  onClick={() => handleEliminar(dir.id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
