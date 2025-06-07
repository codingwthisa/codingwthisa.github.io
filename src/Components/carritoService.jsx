import api from "../api";

export async function agregarLibroAlCarrito(ejemplarId, cantidad = 1) {
  const res = await api.post("/carrito/agregar/", {
    ejemplar_id: ejemplarId,
    cantidad,
  });
  return res.data;
}