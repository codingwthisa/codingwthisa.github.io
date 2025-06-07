import React, { useState } from "react";
import api from "../api";

export default function EjemplarModal({ libroId, onClose, onSave }) {
  const [estado, setEstado] = useState("nuevo");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [disponible, setDisponible] = useState(true);
  const [agotado, setAgotado] = useState(false);
  const [error, setError] = useState("");

  const handleGuardar = async () => {
    if (!precio || parseFloat(precio) <= 0) {
      setError("El precio debe ser mayor a 0.");
      return;
    }
    if (cantidad <= 0) {
      setError("La cantidad debe ser al menos 1.");
      return;
    }

    try {
      await api.post(`libros/${libroId}/agregar_ejemplar/`, {
        estado,
        precio,
        cantidad,
        disponible,
        agotado,
      });
      onSave(); // notificar al padre
      onClose(); // cerrar modal
    } catch (err) {
      console.error("Error al guardar ejemplar:", err);
      setError("Ocurrió un error al guardar el ejemplar.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Agregar Ejemplares</h2>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-3">
          <label className="block font-medium">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
          </select>

          <label className="block font-medium">Precio (COP)</label>
          <input
            type="number"
            min={1}
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block font-medium">Cantidad</label>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
              />
              Disponible
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agotado}
                onChange={(e) => setAgotado(e.target.checked)}
              />
              Agotado
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 text-white rounded bg-[#5A4115] hover:bg-[#3e2f0d]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}