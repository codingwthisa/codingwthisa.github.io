import React, { useEffect, useState } from "react";
import api from "../api";

export default function PasoDireccion({ direccionSeleccionada, setDireccionSeleccionada, onSiguiente }) {
  const [direcciones, setDirecciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    direccion: "",
    detalle: "",
    pais: "",
    departamento: "",
    ciudad: "",
    codigo_postal: "",
  });

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    api.get("direcciones/")
      .then(res => setDirecciones(res.data))
      .catch(() => setError("Error al cargar direcciones"));
  }, []);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(res => res.json())
      .then(data => {
        const lista = data.data.map(p => p.name).sort();
        setPaises(lista);
      });
  }, []);

  useEffect(() => {
    if (!form.pais) return;
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: form.pais })
    })
      .then(res => res.json())
      .then(data => {
        const estados = data.data.states.map(s => ({
          value: s.name,
          label: s.name.replace(/ department| state| province| territory/i, "").trim()
        }));
        setDepartamentos(estados.sort((a, b) => a.label.localeCompare(b.label)));
        setForm(f => ({ ...f, departamento: "", ciudad: "" }));
        setCiudades([]);
      });
  }, [form.pais]);

  useEffect(() => {
    if (!form.pais || !form.departamento) return;
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: form.pais, state: form.departamento })
    })
      .then(res => res.json())
      .then(data => {
        const lista = [...new Set(data.data.filter(c => typeof c === "string" && c.trim()))];
        setCiudades(lista.sort());
      });
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
        setForm({ direccion: "", detalle: "", pais: "", departamento: "", ciudad: "", codigo_postal: "" });
        setMostrarFormulario(false);
        return api.get("direcciones/");
      })
      .then(res => {
        setDirecciones(res.data);
        setMensaje("Dirección añadida correctamente.");
      })
      .catch(() => setError("Error al guardar la dirección"));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Selecciona una dirección</h2>

      {direcciones.length === 0 ? (
        <p className="text-gray-600">No tienes direcciones registradas.</p>
      ) : (
        <ul className="space-y-2">
          {direcciones.map((dir) => (
            <li
              key={dir.id}
              className={`p-4 border rounded cursor-pointer ${direccionSeleccionada === dir.id ? "bg-yellow-100 border-yellow-600" : ""}`}
              onClick={() => setDireccionSeleccionada(dir.id)}
            >
              <p className="font-semibold">{dir.direccion}</p>
              <p className="text-sm">{dir.detalle}</p>
              <p className="text-sm">{dir.ciudad}, {dir.departamento}, {dir.pais} - {dir.codigo_postal}</p>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="text-sm underline text-blue-600"
      >
        {mostrarFormulario ? "Cancelar" : "+ Añadir nueva dirección"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleAgregar} className="grid grid-cols-1 gap-4 mt-4">
          <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required className="p-2 border rounded" />
          <input name="detalle" value={form.detalle} onChange={handleChange} placeholder="Detalle (opcional)" className="p-2 border rounded" />
          <select name="pais" value={form.pais} onChange={handleChange} required className="p-2 border rounded">
            <option value="">Selecciona un país</option>
            {paises.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select name="departamento" value={form.departamento} onChange={handleChange} required className="p-2 border rounded">
            <option value="">Selecciona un departamento</option>
            {departamentos.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select name="ciudad" value={form.ciudad} onChange={handleChange} required className="p-2 border rounded">
            <option value="">Selecciona una ciudad</option>
            {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} placeholder="Código Postal" required className="p-2 border rounded" />
          <button type="submit" className="bg-[#5A4115] text-white px-4 py-2 rounded">Guardar dirección</button>
        </form>
      )}

      <div className="mt-6">
        <button
          onClick={onSiguiente}
          disabled={!direccionSeleccionada}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}