import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import api from "../api";
import { useCarrito } from "./CarritoContext";
import { Trash2 } from "lucide-react";

export default function Carrito({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { actualizarCantidad } = useCarrito();

  const formatoCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get("/carrito/")
      .then((res) => setItems(res.data.items || []))
      .catch((err) => console.error("Error cargando carrito:", err))
      .finally(() => setLoading(false));
  }, [open]);

  const subtotal = Array.isArray(items)
    ? items.reduce((acc, it) => {
        const precio = parseFloat(it.ejemplar?.precio);
        return acc + (isNaN(precio) ? 0 : precio * it.cantidad);
      }, 0)
    : 0;

  const handleRemove = (id) => {
    api
      .delete(`/carrito/item/${id}/eliminar/`)
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        actualizarCantidad(); // ✅ actualiza el numerito
      })
      .catch((err) => console.error("Error eliminando ítem:", err));
  };

  const handleCheckout = () => {
    onClose(); // Cierra el carrito lateral
    window.location.href = "/checkout"; // Solo redirige
  };

  const drawer = (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="cart-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white shadow-2xl rounded-l-2xl flex flex-col"
        >
          {/* Header */}
          <header className="bg-[#704c1f] flex items-center justify-between px-5 py-4 border-b rounded-tl-2xl">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <ShoppingCart className="h-5 w-5" /> Carrito de compras
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </header>

          {/* Contenido */}
          <div className="bg-[#f5efe4] flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Cargando…</p>
            ) : items.length === 0 ? (
              <p className="text-center text-gray-500">Tu carrito está vacío.</p>
            ) : (
              items.map((item) => {
                const libro = item.ejemplar?.libro || {};
                const precio = parseFloat(item.ejemplar?.precio);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border border-[#dbc7a1] rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={libro.imagen || "https://via.placeholder.com/60x90"}
                      alt={libro.titulo || "Sin título"}
                      className="h-20 w-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm leading-snug text-[#5A4115] line-clamp-2">
                        {libro.titulo || "Libro sin título"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        x{item.cantidad} •{" "}
                        {!isNaN(precio)
                          ? formatoCOP(precio)
                          : "Precio inválido"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <footer className="bg-[#704c1f] border-t p-4 space-y-3 text-white rounded-bl-2xl">
            <div className="flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatoCOP(subtotal)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={items.length === 0 || processing}
              className="bg-[#e9ddc6] text-black w-full py-2 rounded-md hover:bg-[#dfd1b4] disabled:opacity-50"
            >
              {processing ? "Procesando…" : "Finalizar compra"}
            </button>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );

  return createPortal(drawer, document.body);
}

export function CartButton({ count = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-black/10 focus:outline-none"
    >
      <ShoppingCart className="h-6 w-6 text-[#5A4115]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs leading-none rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}