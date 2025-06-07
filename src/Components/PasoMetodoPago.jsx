import React, { useState, useEffect } from "react";
import api from "../api";
import visa from "../assets/visa.png";
import mastercard from "../assets/mastercard.png";
import amex from "../assets/amex.png";
import defaultCard from "../assets/card-def.png";

export default function PasoMetodoPago({ metodoSeleccionado, setMetodoSeleccionado, onNext }) {
  const [tarjetas, setTarjetas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState({
    nombre_titular: '',
    numero_tarjeta: '',
    vencimiento: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get("metodos_pago/")
      .then(res => setTarjetas(res.data))
      .catch(() => setError("Error al cargar métodos de pago"));
  }, []);

  const detectarTipoTarjeta = (numero) => {
    if (/^4/.test(numero)) return visa;
    if (/^5[1-5]/.test(numero) || /^2[2-7]/.test(numero)) return mastercard;
    if (/^3[47]/.test(numero)) return amex;
    return defaultCard;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre_titular' && !/^[a-zA-Z\s]*$/.test(value)) return;
    if ((name === 'numero_tarjeta' || name === 'cvv') && !/^[0-9]*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    if (form.numero_tarjeta.length < 13 || form.numero_tarjeta.length > 16) {
      setError("El número de tarjeta debe tener entre 13 y 16 dígitos.");
      return;
    }
    if (form.cvv.length < 3) {
      setError("El CVV debe tener al menos 3 dígitos.");
      return;
    }

    const vencimientoFormateado = form.vencimiento ? `${form.vencimiento}-01` : "";

    api.post("metodos_pago/agregar/", {
      ...form,
      vencimiento: vencimientoFormateado,
    })
      .then(() => {
        setForm({ nombre_titular: '', numero_tarjeta: '', vencimiento: '', cvv: '' });
        setMostrarFormulario(false);
        setMensaje("Tarjeta registrada exitosamente.");
        return api.get("metodos_pago/");
      })
      .then(res => setTarjetas(res.data))
      .catch(() => setError("Error al registrar la tarjeta"));
  };

  const handleSeleccionar = (id) => {
    setMetodoSeleccionado(id);
  };

  const handleContinuar = () => {
    if (!metodoSeleccionado) return;
    onNext();
  };

  const obtenerMinFecha = () => {
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Selecciona un método de pago</h2>
      {tarjetas.length === 0 ? (
        <p className="text-gray-500">No tienes tarjetas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {tarjetas.map(t => (
            <li
              key={t.id}
              onClick={() => handleSeleccionar(t.id)}
              className={`border p-4 rounded flex gap-4 items-center cursor-pointer hover:bg-gray-50 ${metodoSeleccionado === t.id ? 'border-[#704c1f]' : ''}`}
            >
              <img src={detectarTipoTarjeta(t.numero_tarjeta)} alt="tipo" className="w-10 h-6 object-contain" />
              <div>
                <p className="font-medium">{t.nombre_titular}</p>
                <p className="text-sm text-gray-500">•••• {t.numero_tarjeta.slice(-4)} - Vence {t.vencimiento}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="bg-[#5A4115] text-white px-4 py-2 rounded text-sm"
      >
        {mostrarFormulario ? 'Cancelar' : 'Añadir nueva tarjeta'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleAgregar} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="nombre_titular"
            value={form.nombre_titular}
            onChange={handleChange}
            placeholder="Nombre del titular"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="numero_tarjeta"
            value={form.numero_tarjeta}
            onChange={handleChange}
            placeholder="Número de tarjeta"
            className="p-2 border rounded"
            maxLength={16}
            required
          />
          <input
            type="month"
            name="vencimiento"
            value={form.vencimiento}
            onChange={handleChange}
            min={obtenerMinFecha()}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="cvv"
            value={form.cvv}
            onChange={handleChange}
            placeholder="CVV"
            className="p-2 border rounded"
            required
            minLength={3}
            maxLength={4}
          />
          <button type="submit" className="bg-[#5A4115] text-white px-4 py-2 rounded w-fit self-end">
            Guardar tarjeta
          </button>
        </form>
      )}

      <button
        onClick={handleContinuar}
        disabled={!metodoSeleccionado}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
      >
        Continuar
      </button>
    </div>
  );
}