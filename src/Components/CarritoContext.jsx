import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  // const ejemplarId = product.ejemplares?.[0]?.id;

  const actualizarCantidad = async () => {
    try {
      const res = await api.get("/carrito/");
      const total = res.data.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
      setCantidadCarrito(total);
    } catch (err) {
      console.error("Error actualizando cantidad del carrito:", err);
    }
  };

  const agregarAlCarrito = async (ejemplarId, cantidad = 1) => {
    try {
      await api.post("/carrito/agregar/", { ejemplar_id: ejemplarId, cantidad });
    } catch (err) {
      const mensaje = err?.response?.data?.error || "";
  
      // Si el ejemplar ya está en el carrito, lo ignoramos
      if (!mensaje.includes("ya está en tu carrito")) {
        console.error("Error al agregar al carrito:", mensaje);
        throw err;  // solo lanzamos si no es ese caso
      }
    } finally {
      await actualizarCantidad();  // ✅ actualizamos sin importar si hubo error
    }
  };

  useEffect(() => {
    actualizarCantidad(); // al montar
  }, []);

  return (
    <CarritoContext.Provider value={{ cantidadCarrito, agregarAlCarrito, actualizarCantidad }}>
      {children}
    </CarritoContext.Provider>
  );
}

export default CarritoProvider;
export const useCarrito = () => useContext(CarritoContext); // ✅ esto es clave