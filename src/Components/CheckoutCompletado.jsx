import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutCompletado() {
  const location = useLocation();
  const navigate = useNavigate();

  const datosCompra = location.state;

  if (!datosCompra) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">No hay datos de la compra.</h1>
        <button
          className="mt-4 px-4 py-2 bg-[#704c1f] text-white rounded"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f0] p-10 flex flex-col items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-[#5A4115]">
        <h1 className="text-3xl font-bold mb-6 text-center">¡Gracias por tu compra!</h1>
        <p className="text-lg mb-2 text-center">Tu pedido ha sido procesado exitosamente.</p>

        <div className="mt-6 space-y-2">
          <p><span className="font-semibold">ID del pedido:</span> {datosCompra.pedido_id}</p>
          <p><span className="font-semibold">Fecha de compra:</span> {datosCompra.fecha}</p>
          <p><span className="font-semibold">Total:</span> ${parseFloat(datosCompra.total).toLocaleString('es-CO')}</p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-[#704c1f] hover:bg-[#5a3c18] text-white px-6 py-2 rounded shadow-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}