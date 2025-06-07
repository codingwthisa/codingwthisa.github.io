import React, { useState } from "react";

const Registro = ({ onNext, initialData = {} }) => {
  const [nombre, setNombre] = useState(initialData.nombre || "");
  const [apellido, setApellido] = useState(initialData.apellido || "");
  const [tipoDocumento, setTipoDocumento] = useState(initialData.tipoDocumento || "DNI");
  const [documento, setDocumento] = useState(initialData.documento || "");
  const [fechaNacimiento, setFechaNacimiento] = useState(initialData.fechaNacimiento || "");
  const [genero, setGenero] = useState(initialData.genero || "");
  const [correo, setCorreo] = useState(initialData.correo || "");
  const [error, setError] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const validateNombre = (valor) => {
    const trimmed = valor.trim();
    return trimmed.length >= 2 && /^[A-Za-zÀ-ÿ\s]+$/.test(trimmed);
  };

  const validateApellido = (valor) => {
    const trimmed = valor.trim();
    return trimmed.length >= 2 && /^[A-Za-zÀ-ÿ\s]+$/.test(trimmed);
  };

  const validateEmail = (valor) => {
    const trimmed = valor.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(trimmed);
  };

  const validateDocumento = (valor) => {
    if (tipoDocumento === "Cédula") {
      return /^\d{10}$/.test(valor);
    }
    if (tipoDocumento === "DNI") {
      return /^[a-zA-Z0-9]{6,12}$/.test(valor);
    }
    if (tipoDocumento === "Pasaporte") {
      return /^[a-zA-Z0-9]{6,15}$/.test(valor);
    }
    return false;
  };

  const validateFecha = (valor) => valor.trim().length > 0;
  const validateGenero = (valor) => valor.trim().length > 0;

  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMostrarAlerta(false);

    if (!validateNombre(nombre)) {
      setError("El nombre debe tener al menos 2 letras y solo letras.");
      setMostrarAlerta(true);
      return;
    }
    if (!validateApellido(apellido)) {
      setError("El apellido debe tener al menos 2 letras y solo letras.");
      setMostrarAlerta(true);
      return;
    }
    if (!validateDocumento(documento)) {
      setError("Número de identificación no válido para el tipo seleccionado.");
      setMostrarAlerta(true);
      return;
    }
    if (!validateFecha(fechaNacimiento)) {
      setError("La fecha de nacimiento es obligatoria.");
      setMostrarAlerta(true);
      return;
    }
    if (!validateGenero(genero)) {
      setError("Debe seleccionar un género.");
      setMostrarAlerta(true);
      return;
    }
    if (!validateEmail(correo)) {
      setError("El correo electrónico no es válido.");
      setMostrarAlerta(true);
      return;
    }

    const datosPaso1 = {
      nombre,
      apellido,
      tipoDocumento,
      documento,
      fechaNacimiento,
      genero,
      correo,
    };

    onNext(datosPaso1);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex justify-center mt-12 mb-12">
        <div className="bg-[#DACCB2] p-8 rounded-lg shadow-lg w-96 relative">
          <h2 className="text-xl font-bold mb-4">Registro</h2>

          {mostrarAlerta && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
              <div className="bg-white border border-red-300 text-red-700 px-6 py-4 rounded-lg shadow-xl max-w-md w-full text-center relative">
                <span className="text-base font-semibold block">{error}</span>
                <button
                  onClick={() => setMostrarAlerta(false)}
                  className="absolute top-2 right-2 text-lg text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-gray-800 block font-medium text-left mb-1">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <label className="text-gray-800 block font-medium text-left mb-1 mt-4">Apellido</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-2">
              <select
                className="w-1/3 p-2 border rounded"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
              >
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cédula">Cédula</option>
              </select>
              <input
                type="text"
                placeholder="Número de documento"
                className="w-2/3 p-2 border rounded"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-gray-800 block font-medium text-left">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                min={minDate}
                max={maxDate}
                onKeyDown={(e) => e.preventDefault()}
                required
              />
            </div>
            <div>
              <label className="text-gray-800 block font-medium text-left">Género</label>
              <select
                className="w-full p-2 border rounded"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="text-gray-800 block font-medium text-left">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <button
              id="siguiente_registro1"
              type="submit"
              className="w-full text-white p-2 rounded"
              style={{ backgroundColor: "#624818" }}
            >
              Siguiente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;