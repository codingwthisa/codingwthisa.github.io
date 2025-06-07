import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Reservas() {
  const [activas, setActivas] = useState([]);
  const [inactivas, setInactivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroInactivas, setFiltroInactivas] = useState("todas");
  const [paginaInactivas, setPaginaInactivas] = useState(1);

  const POR_PAGINA = 4;

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const [resActivas, resInactivas] = await Promise.all([
        api.get("/reservas/activas/"),
        api.get("/reservas/inactivas/")
      ]);
      setActivas(resActivas.data);
      setInactivas(resInactivas.data);
    } catch (err) {
      toast.error("Error al cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (id) => {
    try {
      await api.post(`/reservas/${id}/cancelar/`);
      toast.success("Reserva cancelada.");
      cargarReservas();
    } catch (err) {
      toast.error("No se pudo cancelar la reserva.");
    }
  };

  const renderReserva = (reserva, activa = true) => (
    <div
      key={reserva.id}
      className="border p-4 rounded shadow-sm bg-white flex justify-between items-center"
    >
      <div>
        <p className="font-semibold">{reserva.ejemplar.libro.titulo}</p>
        <p className="text-sm text-gray-600">
          Fecha: {new Date(reserva.fecha_creacion).toLocaleString()}
        </p>
        {!activa && (
          <p className="text-xs text-gray-500">
            Expiró el: {new Date(reserva.fecha_expiracion).toLocaleString()}
          </p>
        )}
      </div>
      {activa && (
        <button
          onClick={() => cancelarReserva(reserva.id)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Cancelar
        </button>
      )}
    </div>
  );

  const inactivasFiltradas = inactivas.filter((r) => {
    if (filtroInactivas === "todas") return true;
    const esExpirada = new Date(r.fecha_expiracion) < new Date();
    return filtroInactivas === "expiradas" ? esExpirada : !esExpirada;
  });

  const totalPaginas = Math.ceil(inactivasFiltradas.length / POR_PAGINA);
  const paginadas = inactivasFiltradas.slice(
    (paginaInactivas - 1) * POR_PAGINA,
    paginaInactivas * POR_PAGINA
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Reservas Activas</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : activas.length === 0 ? (
          <p className="text-gray-600">No tienes reservas activas.</p>
        ) : (
          <div className="grid gap-4">{activas.map((r) => renderReserva(r))}</div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Histórico de Reservas</h2>

        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm">Filtrar por:</label>
          <select
            value={filtroInactivas}
            onChange={(e) => {
              setFiltroInactivas(e.target.value);
              setPaginaInactivas(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="todas">Todas</option>
            <option value="expiradas">Solo expiradas</option>
            <option value="canceladas">Solo canceladas</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {paginadas.length === 0 ? (
            <p className="text-sm text-gray-600">No hay reservas en esta categoría.</p>
          ) : (
            paginadas.map((r) => renderReserva(r, false))
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={paginaInactivas === 1}
              onClick={() => setPaginaInactivas((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-2">Página {paginaInactivas} de {totalPaginas}</span>
            <button
              disabled={paginaInactivas === totalPaginas}
              onClick={() => setPaginaInactivas((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}