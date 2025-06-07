import React, { useEffect, useState } from "react";
import api from "../api";

export default function MensajeriaAdmin() {
  const [mensajes, setMensajes] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    api.get("/mensajes/")
      .then((res) => setMensajes(res.data))
      .catch((err) => console.error("Error cargando mensajes:", err));
  }, []);

  const handleResponder = async (mensajeId) => {
    const contenido = respuestas[mensajeId];
    if (!contenido?.trim()) return;

    try {
      await api.post(`/mensajes/${mensajeId}/responder/`, { contenido });
      setRespuestas((prev) => ({ ...prev, [mensajeId]: "" }));
      const updated = await api.get("/mensajes/");
      setMensajes(updated.data);
    } catch (err) {
      console.error("Error al responder mensaje:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3eee4] p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#5A4115]">Foro de Clientes</h1>
      <div className="space-y-6">
        {mensajes.length === 0 ? (
          <p className="text-center text-gray-600">No hay mensajes publicados aún.</p>
        ) : (
          mensajes.map((msg, idx) => (
            <div key={idx} className="bg-white border rounded-md shadow p-4 space-y-2">
              {/* Encabezado con info del cliente */}
              <h2 className="font-semibold text-[#5A4115]">
                {msg.cliente?.nombre} {msg.cliente?.apellido} ({msg.cliente?.email})
              </h2>

              {/* Mensaje del cliente */}
              <div className="bg-gray-100 p-3 rounded-md shadow-sm">
                {msg.contenido}
                <div className="text-xs text-right text-gray-500">
                  {new Date(msg.fecha_creacion).toLocaleString()}
                </div>
              </div>

              {/* Respuestas del admin */}
              {msg.respuestas?.map((resp, rIdx) => (
                <div key={rIdx} className="bg-gray-100 p-3 rounded-md shadow-sm ml-4">
                  <strong className="text-[#5A4115]">Admin:</strong> {resp.contenido}
                  <div className="text-xs text-right text-gray-500">
                    {new Date(resp.fecha_respuesta).toLocaleString()}
                  </div>
                </div>
              ))}

              {/* Campo de respuesta */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Escribe una respuesta..."
                  value={respuestas[msg.id] || ""}
                  onChange={(e) => setRespuestas({ ...respuestas, [msg.id]: e.target.value })}
                  className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={() => handleResponder(msg.id)}
                  className="bg-[#5A4115] hover:bg-[#3e2f0d] text-white px-4 py-1 rounded text-sm"
                >
                  Responder
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}