import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { agregarLibroAlCarrito } from "./carritoService";
import { useCarrito } from "./CarritoContext";
import { toast, ToastContainer } from "react-toastify";

export default function LibroDetalle() {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const { actualizarCantidad } = useCarrito();

  useEffect(() => {
    api.get(`libros/${id}/`)
      .then(res => setLibro(res.data))
      .catch(() => setError("No se pudo cargar el libro."));
  }, [id]);

  const agregarAlCarrito = async () => {
    try {
      const ejemplarId = libro.ejemplares?.[0]?.id;
      if (!ejemplarId) return;

      await agregarLibroAlCarrito(ejemplarId, cantidad);
      await actualizarCantidad();
      toast.success("Libro agregado al carrito");
    } catch (err) {
      setError("Error al agregar al carrito");
      toast.error("No se pudo agregar al carrito");
      console.error(err);
    }
  };

  const reservarEjemplar = async () => {
    const ejemplaresDisponibles = libro.ejemplares?.filter(e => e.disponible);
  
    if (!ejemplaresDisponibles || ejemplaresDisponibles.length === 0) {
      toast.error("Este libro no tiene ejemplares disponibles.");
      return;
    }
  
    // Toma el primer ejemplar disponible (aún no reservado)
    const ejemplarAReservar = ejemplaresDisponibles[0];
  
    try {
      await api.post("/reservas/crear/", { ejemplar_id: ejemplarAReservar.id });
      toast.success("Reserva realizada con éxito. Recuerda que vence en 24 horas.");
  
      // 🔄 Actualizar estado del libro tras reservar
      const res = await api.get(`libros/${id}/`);
      setLibro(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo hacer la reserva.";
      toast.error(msg);
    }
  };

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!libro) return <p className="text-center mt-10">Cargando libro...</p>;

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-[#5A4115] px-6 py-12">
      <div className="max-w-6xl mx-auto bg-white rounded shadow p-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="flex justify-center">
          <img
            src={libro.imagen || "https://via.placeholder.com/200x300"}
            alt={libro.titulo}
            className="w-60 h-[450px] object-cover rounded"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{libro.titulo}</h1>
          <p><strong>Autor</strong> {libro.autor}</p>
          <p className="italic text-sm text-gray-600">{libro.editorial}</p>
          <p className="text-2xl font-bold text-[#5A4115] mt-4">
            ${parseInt(libro.ejemplares?.[0]?.precio || 0).toLocaleString("es-CO")} COP
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="px-3 py-1 text-lg"
              >
                –
              </button>
              <span className="px-4">{cantidad}</span>
              <button
                onClick={() => setCantidad(cantidad + 1)}
                className="px-3 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={agregarAlCarrito}
              className="px-6 py-2 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d]"
            >
              Agregar al carrito
            </button>

            <button
              onClick={reservarEjemplar}
              className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Reservar
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-700 space-y-1">
            <p><strong>Año de publicación</strong> {libro.anio_publicacion}</p>
            <p><strong>Páginas</strong> {libro.numero_paginas}</p>
            <p><strong>Idioma</strong> {libro.idioma}</p>
            <p><strong>ISSN</strong> {libro.issn}</p>
            <p><strong>Fecha publicación</strong> {libro.fecha_publicacion}</p>
            <p><strong>Estado</strong> {libro.ejemplares?.[0]?.estado || "N/A"}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="bg-[#e6decf] text-[#5A4115] px-3 py-1 text-xs rounded-full">
              {libro.genero}
            </span>
            <span className="bg-[#e6decf] text-[#5A4115] px-3 py-1 text-xs rounded-full">
              {libro.categoria}
            </span>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}