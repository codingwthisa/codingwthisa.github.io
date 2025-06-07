import React, { useState, useEffect } from "react";

const Registro2 = ({ onNext, onPrevious }) => {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  const [paisSeleccionado, setPaisSeleccionado] = useState("");
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");

  const [direccion, setDireccion] = useState("");
  const [direccionDetalle, setDireccionDetalle] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
        const data = await res.json();
        const listaPaises = data.data.map(p => p.name).sort((a, b) => a.localeCompare(b));
        setPaises(listaPaises);
      } catch (error) {
        console.error("Error al obtener países", error);
      }
    };
    fetchPaises();
  }, []);

  useEffect(() => {
    if (!paisSeleccionado) return;
    const fetchDepartamentos = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: paisSeleccionado }),
        });
        const data = await res.json();
        const limpiarNombre = (nombre) =>
          nombre
            .replace(/ department$/i, "")
            .replace(/ state$/i, "")
            .replace(/ province$/i, "")
            .replace(/ territory$/i, "")
            .trim();
        const estados = data.data.states.map((s) => ({
          value: s.name,
          label: limpiarNombre(s.name),
        }));
        setDepartamentos(estados.sort((a, b) => a.label.localeCompare(b.label)));
        setDepartamentoSeleccionado("");
        setCiudades([]);
      } catch (error) {
        console.error("Error al obtener departamentos", error);
      }
    };
    fetchDepartamentos();
  }, [paisSeleccionado]);

  useEffect(() => {
    if (!paisSeleccionado || !departamentoSeleccionado) return;
    const fetchCiudades = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: paisSeleccionado,
            state: departamentoSeleccionado,
          }),
        });
        const data = await res.json();
        let ciudadesLimpias = [];
        if (data && Array.isArray(data.data)) {
          ciudadesLimpias = data.data
            .filter(c => typeof c === "string" && c.trim().length > 0)
            .map(c => c.trim());
          ciudadesLimpias = [...new Set(ciudadesLimpias)];
        }
        setCiudades(ciudadesLimpias.sort((a, b) => a.localeCompare(b)));
        setCiudadSeleccionada("");
      } catch (error) {
        console.error("❌ Error al obtener ciudades:", error);
        setCiudades([]);
        setCiudadSeleccionada("");
      }
    };
    fetchCiudades();
  }, [paisSeleccionado, departamentoSeleccionado]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paisSeleccionado || !departamentoSeleccionado || !ciudadSeleccionada) {
      setError("Por favor, selecciona país, departamento y ciudad.");
      return;
    }

    if (!direccion.trim() || !direccionDetalle.trim() || !codigoPostal.trim()) {
      setError("Por favor, completa todos los campos de dirección.");
      return;
    }

    const datosPaso2 = {
      direccion,
      direccionDetalle,
      pais: paisSeleccionado,
      departamento: departamentoSeleccionado,
      ciudad: ciudadSeleccionada,
      codigoPostal,
    };
    onNext(datosPaso2);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex justify-center mt-12 mb-12">
        <div className="bg-[#DACCB2] p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Dirección</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label>Dirección</label>
              <input type="text" placeholder="Calle" className="w-full px-3 py-2 border rounded" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              <input type="text" placeholder="Detalle" className="w-full px-3 py-2 border rounded mt-2" value={direccionDetalle} onChange={(e) => setDireccionDetalle(e.target.value)} required />
            </div>

            <div>
              <label>País</label>
              <select value={paisSeleccionado} onChange={(e) => setPaisSeleccionado(e.target.value)} className="w-full p-2 border rounded" required>
                <option value="">Selecciona un país</option>
                {paises.map((pais) => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Departamento/Estado</label>
              <select value={departamentoSeleccionado} onChange={(e) => setDepartamentoSeleccionado(e.target.value)} className="w-full p-2 border rounded" required>
                <option value="">Selecciona un departamento</option>
                {departamentos.map((depto) => (
                  <option key={depto.value} value={depto.value}>{depto.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Ciudad</label>
              <select value={ciudadSeleccionada} onChange={(e) => setCiudadSeleccionada(e.target.value)} className="w-full p-2 border rounded" required disabled={ciudades.length === 0}>
                <option value="">Selecciona una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
              {ciudades.length === 0 && departamentoSeleccionado && (
                <p className="text-sm text-gray-500 italic mt-1">No se encontraron ciudades para este departamento.</p>
              )}
            </div>

            <div>
              <label>Código Postal</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="Código Postal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} required />
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={onPrevious} className="w-1/3 text-white p-2 rounded" style={{ backgroundColor: "#624818" }}>
                Atrás
              </button>
              <button type="submit" className="w-1/3 text-white p-2 rounded ml-auto" style={{ backgroundColor: "#624818" }}>
                Siguiente
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center space-y-3">
            <h3 className="text-lg font-bold text-[#5A4115]">Error en la dirección</h3>
            <p className="text-sm text-gray-700">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 px-4 py-2 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro2;