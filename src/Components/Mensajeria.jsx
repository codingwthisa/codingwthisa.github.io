import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Mensajeria() {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/mensajes/")
      .then(res => setMensajes(res.data))
      .catch(err => console.error("Error cargando mensajes:", err))
      .finally(() => setLoading(false));
  }, []);

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;

    api.post("/mensajes/", { contenido: nuevoMensaje })
      .then(res => {
        setMensajes(prev => [...prev, res.data]);
        setNuevoMensaje("");
      })
      .catch(err => console.error("Error al enviar mensaje:", err));
  };

  return (
    <div className="min-h-screen bg-[#e8ddc9] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-[#5A4115]">Soporte al Cliente</h2>

        {/* Crear nuevo mensaje */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 border border-gray-300">
          <textarea
            className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring focus:border-blue-300"
            rows={3}
            placeholder="Escribe tu mensaje o consulta aquí..."
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              className="bg-[#5A4115] hover:bg-[#3e2f0d] text-white px-4 py-2 rounded text-sm"
              onClick={enviarMensaje}
            >
              Enviar
            </button>
          </div>
        </div>

        {/* Lista de mensajes + respuestas */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-gray-500 text-center">Cargando mensajes...</p>
          ) : mensajes.length === 0 ? (
            <p className="text-gray-500 text-center">No has enviado ningún mensaje aún.</p>
          ) : (
            mensajes.map((msg) => (
              <div key={msg.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                {/* Mensaje del cliente */}
                <div className="mb-2">
                  <div className="text-sm text-[#5A4115] font-semibold">Tú escribiste:</div>
                  <div className="bg-blue-50 px-4 py-2 rounded mt-1 text-gray-800">
                    {msg.contenido}
                  </div>
                  <div className="text-xs mt-1 text-right text-gray-500 italic">
                    {new Date(msg.fecha_creacion).toLocaleString()}
                  </div>
                </div>

                {/* Respuestas del admin */}
                {msg.respuestas && msg.respuestas.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.respuestas.map((resp) => (
                      <div key={resp.id} className="bg-yellow-100 text-[#5A4115] px-4 py-2 rounded shadow-sm">
                        <span className="font-medium">Admin:</span> {resp.contenido}
                        <div className="text-[11px] mt-1 text-right opacity-60">
                          {new Date(resp.fecha_respuesta).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}