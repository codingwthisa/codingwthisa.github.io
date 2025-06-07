import React, { useEffect, useState } from 'react';
import api from "../../api";
import visa from '../../assets/visa.png';
import mastercard from '../../assets/mastercard.png';
import amex from '../../assets/amex.png';
import defaultCard from '../../assets/card-def.png';

export default function TarjetasCredito() {
  const [form, setForm] = useState({
    nombre_titular: '',
    numero_tarjeta: '',
    vencimiento: '',
    cvv: '',
  });

  const [tarjetas, setTarjetas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const cargarTarjetas = () => {
    api.get("metodos_pago/")
      .then(res => setTarjetas(res.data))
      .catch(() => setError("Error al cargar tarjetas."));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre_titular' && !/^[a-zA-Z\s]*$/.test(value)) return;
    if ((name === 'numero_tarjeta' || name === 'cvv') && !/^[0-9]*$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

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
        cargarTarjetas();
      })
      .catch(() => setError("Error al registrar la tarjeta."));
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Eliminar esta tarjeta?")) {
      api.delete(`metodos_pago/${id}/eliminar/`)
        .then(() => {
          setMensaje("Tarjeta eliminada.");
          cargarTarjetas();
        })
        .catch(() => setError("No se pudo eliminar la tarjeta."));
    }
  };

  const detectarTipoTarjeta = (numero) => {
    if (/^4/.test(numero)) return visa;
    if (/^5[1-5]/.test(numero) || /^2[2-7]/.test(numero)) return mastercard;
    if (/^3[47]/.test(numero)) return amex;
    return defaultCard;
  };

  const obtenerMinFecha = () => {
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex justify-center items-start py-10 px-4">
      <div className="bg-white p-6 rounded shadow max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#5A4115]">Tarjetas de crédito</h2>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-[#5A4115] text-white px-4 py-2 rounded hover:bg-[#3e2f0d] text-sm"
          >
            {mostrarFormulario ? 'Cancelar' : 'Añadir nueva tarjeta'}
          </button>
        </div>
  
        {mensaje && <p className="text-green-600 mb-2 text-sm">{mensaje}</p>}
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
  
        {mostrarFormulario && (
          <form onSubmit={handleAgregar} className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Nombre del titular</label>
              <input
                type="text"
                name="nombre_titular"
                value={form.nombre_titular}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
                required
              />
            </div>
  
            <div>
              <label className="text-sm font-medium">Número de tarjeta</label>
              <div className="flex items-center border p-2 rounded mt-1">
                <input
                  type="text"
                  name="numero_tarjeta"
                  value={form.numero_tarjeta}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                  maxLength={16}
                />
                <img
                  key={form.numero_tarjeta}
                  src={detectarTipoTarjeta(form.numero_tarjeta)}
                  alt="icono tarjeta"
                  className="w-8 h-6 ml-2 object-contain"
                />
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Vencimiento</label>
                <input
                  type="month"
                  name="vencimiento"
                  value={form.vencimiento}
                  onChange={handleChange}
                  min={obtenerMinFecha()}
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1"
                  required
                  minLength={3}
                  maxLength={4}
                />
              </div>
            </div>
  
            <button
              type="submit"
              className="bg-[#5A4115] text-white px-4 py-2 rounded mt-2"
            >
              Guardar tarjeta
            </button>
          </form>
        )}
  
        <h3 className="text-lg font-bold text-[#5A4115] mb-4">Tarjetas registradas</h3>
        {tarjetas.length === 0 ? (
          <p className="text-gray-500">Aún no tienes tarjetas.</p>
        ) : (
          <ul className="space-y-4">
            {tarjetas.map((t) => (
              <li key={t.id} className="border p-4 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={detectarTipoTarjeta(t.numero_tarjeta)}
                    alt="tipo"
                    className="w-10 h-6 object-contain"
                  />
                  <div>
                    <p className="font-semibold">{t.nombre_titular}</p>
                    <p className="text-sm text-gray-600">•••• •••• •••• {t.numero_tarjeta.slice(-4)}</p>
                    <p className="text-sm text-gray-600">Vence: {t.vencimiento}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEliminar(t.id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}