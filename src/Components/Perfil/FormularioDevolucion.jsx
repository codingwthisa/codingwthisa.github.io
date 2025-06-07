import React, { useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

export default function FormularioDevolucion({ ejemplarId, onClose }) {
  const [causa, setCausa] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!causa) {
      toast.warning("Selecciona una causa de devolución.");
      return;
    }

    setEnviando(true);
    try {
      await api.post('/devoluciones/solicitar/', {
        ejemplar_id: ejemplarId,
        causa: causa,
        motivo_ampliado: motivo
      });
      toast.success("Solicitud de devolución enviada con éxito.");
      onClose(); // Cierra el formulario
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "No se pudo procesar la solicitud.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold text-[#5A4115] mb-4">Solicitar Devolución</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Causa de devolución</label>
            <select
              value={causa}
              onChange={(e) => setCausa(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Selecciona una causa --</option>
              <option value="mal_estado">Producto en mal estado</option>
              <option value="no_expectativas">No llenó las expectativas</option>
              <option value="pedido_tarde">El pedido llegó tarde</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Motivo adicional (opcional)</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows="4"
              className="w-full border rounded px-3 py-2"
              placeholder="Escribe aquí tu motivo si deseas ampliarlo"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d]"
              disabled={enviando}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}