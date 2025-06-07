import React, { useEffect, useState } from 'react';
import api from '../api';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Direcciones from './Perfil/Direcciones';
import TarjetasCredito from './Perfil/TarjetasCredito';

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [mostrarGestorDirecciones, setMostrarGestorDirecciones] = useState(false);
  const [mostrarGestorTarjetas, setMostrarGestorTarjetas] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/carrito/").then(res => setItems(res.data.items || [])),
      api.get("/direcciones/").then(res => setDirecciones(res.data)),
      api.get("/metodos_pago/").then(res => setMetodos(res.data))
    ]).finally(() => setLoading(false));
  }, []);

  const subtotal = items.reduce((acc, item) => acc + (item.ejemplar?.precio || 0) * item.cantidad, 0);

  const handleCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    setItems(prev => prev.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
  };

  const handleEliminar = (id) => {
    api.delete(`/carrito/item/${id}/eliminar/`).then(() => {
      setItems(prev => prev.filter(item => item.id !== id));
    });
  };

  console.log({
    direccion_id: direccionSeleccionada,
    metodo_pago_id: metodoSeleccionado
  });

  const handleConfirmarCompra = () => {
    api.post("/carrito/comprar/", {
    direccion_id: direccionSeleccionada,
    metodo_pago_id: metodoSeleccionado,
  })
  .then((res) => {
    setItems([]); // Vaciar carrito visualmente

    navigate("/checkout/completado", {
      state: res.data,
    });
  })
  .catch((err) => {
    console.error(err);
  });
  };

  if (loading) return <div className="p-6 text-center">Cargando carrito...</div>;

  return (
    <div className="p-8 flex flex-col lg:flex-row justify-between gap-10 min-h-screen bg-white">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Tu pedido</h1>

        {items.map(item => (
          <div key={item.id} className="border rounded p-4 mb-4 flex items-center gap-4">
            <img src={item?.ejemplar?.libro?.imagen} alt="Libro" className="w-12 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold">{item?.ejemplar?.libro?.titulo}</p>
              <p className="text-sm text-gray-600">{item?.ejemplar?.libro?.autor}</p>
              <p className="text-sm">${item?.ejemplar?.precio?.toLocaleString('es-CO')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleCantidad(item.id, item.cantidad - 1)} className="border px-2">−</button>
              <span>{item.cantidad}</span>
              <button onClick={() => handleCantidad(item.id, item.cantidad + 1)} className="border px-2">+</button>
              <button onClick={() => handleEliminar(item.id)} className="text-red-500 ml-2"><FaTrash /></button>
            </div>
          </div>
        ))}

        <h2 className="text-lg font-semibold mt-8 mb-2">Dirección de envío</h2>
        {direcciones.map(dir => (
          <label key={dir.id} className="block border p-4 rounded mb-3 cursor-pointer">
            <input type="radio" name="direccion" value={dir.id} checked={direccionSeleccionada === String(dir.id)}
              onChange={() => setDireccionSeleccionada(String(dir.id))} className="mr-2" />
            <div>
              <p className="font-semibold">{dir.direccion}</p>
              <p className="text-sm text-gray-600">{dir.ciudad}, {dir.departamento}, {dir.pais}</p>
              <p className="text-sm text-gray-500">Código Postal: {dir.codigo_postal}</p>
            </div>
          </label>
        ))}
        <button onClick={() => setMostrarGestorDirecciones(true)} className="mt-2 text-sm text-blue-600 hover:underline">
          Añadir nueva dirección
        </button>

        <h2 className="text-lg font-semibold mt-8 mb-2">Método de pago</h2>
        {metodos.map(met => (
          <label key={met.id} className="block border p-4 rounded mb-3 cursor-pointer">
            <input type="radio" name="metodo" value={met.id} checked={metodoSeleccionado === String(met.id)}
              onChange={() => setMetodoSeleccionado(String(met.id))} className="mr-2" />
            <div>
              <p className="font-semibold">•••• •••• •••• {met.numero_tarjeta.slice(-4)}</p>
              <p className="text-sm text-gray-600">Titular: {met.nombre_titular}</p>
              <p className="text-sm text-gray-500">Vence: {met.vencimiento}</p>
            </div>
          </label>
        ))}
        <button onClick={() => setMostrarGestorTarjetas(true)} className="mt-2 text-sm text-blue-600 hover:underline">
          Añadir nuevo método de pago
        </button>

        <button disabled={!direccionSeleccionada || !metodoSeleccionado}
          onClick={handleConfirmarCompra}
          className="bg-[#704c1f] hover:bg-[#5c3a17] text-white px-6 py-2 rounded shadow-sm transition disabled:opacity-50 mt-4">
          Confirmar compra
        </button>
      </div>

      <div className="w-full lg:w-80 border rounded-xl p-6 shadow-sm">
        <input type="text" placeholder="Añadir cupón" className="w-full border px-4 py-2 rounded mb-4" />
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-semibold">${subtotal.toLocaleString('es-CO')}</span>
        </div>
        <div className="flex justify-between mb-6">
          <span className="text-base font-semibold">Total</span>
          <span className="text-base font-semibold">${subtotal.toLocaleString('es-CO')}</span>
        </div>
      </div>

      {mostrarGestorDirecciones && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-4">
            <Direcciones onUpdate={() => api.get("/direcciones/").then(res => setDirecciones(res.data))} />
            <div className="flex justify-end mt-4">
              <button onClick={() => setMostrarGestorDirecciones(false)} className="text-red-600 font-medium">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarGestorTarjetas && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-4">
            <TarjetasCredito onUpdate={() => api.get("/metodos_pago/").then(res => setMetodos(res.data))} />
            <div className="flex justify-end mt-4">
              <button onClick={() => setMostrarGestorTarjetas(false)} className="text-red-600 font-medium">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}