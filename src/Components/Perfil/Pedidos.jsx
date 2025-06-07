import React, { useEffect, useState } from 'react';
import api from '../../api';
import FormularioDevolucion from "./FormularioDevolucion";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [mostrarResumenId, setMostrarResumenId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState(null);

  useEffect(() => {
    api.get("/pedidos/")
      .then(res => {
        setPedidos(res.data || []);
      })
      .catch(() => setPedidos([]));
  }, []);

  const toggleResumen = (id) => {
    setMostrarResumenId(prev => prev === id ? null : id);
  };

  useEffect(() => {
    // Lógica de actualización automática del estado
    const interval = setInterval(() => {
      api.post("/pedidos/avanzar-estado/")
        .then(res => {
          console.log("Estados actualizados:", res.data);
          // Opcional: recargar pedidos si hay actualizaciones
          return api.get("/pedidos/");
        })
        .then(res => {
          setPedidos(res.data || []);
        })
        .catch(err => {
          console.error("Error actualizando estado de pedidos:", err);
        });
    }, 2 * 60 * 1000); // cada 2 minutos
  
    return () => clearInterval(interval); // Limpieza al desmontar
  }, []);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const abrirFormulario = (ejemplarId) => {
    setEjemplarSeleccionado(ejemplarId);
    setMostrarFormulario(true);
  };

  return (
    <div className="bg-white rounded shadow p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-[#5A4115]">Mis pedidos</h2>

      {pedidos.length === 0 ? (
        <p className="text-gray-500">No tienes pedidos aún.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-[#f0e6d2] text-[#5A4115]">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Resumen</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, idx) => (
              <React.Fragment key={pedido.id}>
                <tr className={`border-t hover:bg-gray-50 ${idx === 0 ? 'bg-[#fdf7ec]' : ''}`}>
                  <td className="px-4 py-2 font-medium">{pedido.id}</td>
                  <td className="px-4 py-2">{formatearFecha(pedido.fecha_creacion)}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    ${parseFloat(pedido.total).toLocaleString('es-CO')} COP
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleResumen(pedido.id)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      {mostrarResumenId === pedido.id ? 'Ocultar' : 'Ver detalles'}
                    </button>
                  </td>
                </tr>

                {mostrarResumenId === pedido.id && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan="5" className="px-4 py-4">
                      <div className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
                        <strong className="text-[#5A4115] block mb-2">Resumen de compra:</strong>
                        {pedido.resumen && pedido.resumen.length > 0 ? (
                          <ul className="space-y-4">
                            {pedido.resumen.map((item, idx) => (
                              <li key={idx} className="flex justify-between items-center text-sm text-gray-700">
                                <div>
                                  <span className="font-medium">{item.titulo}</span> — {item.autor}<br />
                                  {item.cantidad} x ${parseFloat(item.precio_unitario).toLocaleString('es-CO')} COP = <span className="font-medium">${parseFloat(item.subtotal).toLocaleString('es-CO')} COP</span>
                                  {item.devuelto && (
                                    <div className="text-red-500 mt-1 flex items-center gap-4">
                                      <div>
                                        ✔ Devolución registrada
                                        <p className="text-xs text-gray-500">Comprobante QR:</p>
                                      </div>
                                      {item.codigo_qr && (
                                        <img
                                          src={item.codigo_qr}
                                          alt="Código QR de devolución"
                                          crossOrigin="anonymous"
                                          className="w-24 h-24 object-contain border border-gray-300 p-1 bg-white rounded"
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                                {!item.devuelto && (
                                  <button
                                    onClick={() => abrirFormulario(item.ejemplar_id)}
                                    className="bg-yellow-600 text-white text-xs px-3 py-1 rounded hover:bg-yellow-700"
                                  >
                                    Solicitar devolución
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No hay productos en este pedido.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {mostrarFormulario && ejemplarSeleccionado && (
        <FormularioDevolucion
          ejemplarId={ejemplarSeleccionado}
          onClose={() => {
            setMostrarFormulario(false);
            setEjemplarSeleccionado(null);
          }}
        />
      )}
    </div>
  );
}