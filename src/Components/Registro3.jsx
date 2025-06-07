import React, { useState } from "react";

const Registro3 = ({ onSubmit, onPrevious, initialData = {} }) => {
  // Si se requiere, se puede inicializar emailUsuario desde initialData, aunque usualmente ya se recoge en pasos anteriores
  const [password, setPassword] = useState(initialData.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [temaPreferencia, setTemaPreferencia] = useState(initialData.temaPreferencia || "");
  const [newsletter, setNewsletter] = useState(initialData.newsletter || false);
  const [error, setError] = useState("");

  // Función de validación de contraseña:
  // La contraseña debe tener al menos 8 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    // Validar formato de la contraseña
    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }

    // Preparar el objeto con los datos del paso 3.
    // Se incluyen solo los campos de este paso; se asume que los datos como correo ya fueron recogidos en pasos anteriores.
    const datosPaso3 = {
      password, // Usamos "password" en minúsculas, que es lo que espera el backend
      temaPreferencia,
      recibir_noticias:newsletter,
    };

    // Llamar a la función onSubmit pasada desde el contenedor, que fusionará y transformará los datos.
    onSubmit(datosPaso3);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex justify-center mt-12 mb-12">
        <div 
          className="bg-brown-200 p-8 rounded-lg shadow-lg w-96" 
          style={{ backgroundColor: "#DACCB2" }}
        >
          <h2 className="text-xl font-bold mb-4">Registro</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Opcional: Si deseas pedir confirmación de correo aquí, se puede agregar, 
                pero usualmente ya se recoge en pasos anteriores, así que lo omitimos. */}

            <div className="mb-4">
              <label className="text-gray-800 block font-medium text-left mb-1">
                Contraseña
              </label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label className="text-gray-800 block font-medium text-left mb-1">
                Confirmar Contraseña
              </label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <label className="text-gray-800 block font-medium text-left mb-1">
                Temas literarios de preferencia
              </label>
              <select 
                className="w-full p-2 border rounded"
                value={temaPreferencia}
                onChange={(e) => setTemaPreferencia(e.target.value)}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Ficción">Ficción</option>
                <option value="No Ficción">No Ficción</option>
                <option value="Fantasía">Fantasía</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Misterio y Suspenso">Misterio y Suspenso</option>
                <option value="Terror">Terror</option>
                <option value="Romance">Romance</option>
                <option value="Comedia">Comedia</option>
                <option value="Histórico">Histórico</option>
                <option value="Biografía y Memorias">Biografía y Memorias</option>
                <option value="Autoayuda y Desarrollo Personal">Autoayuda y Desarrollo Personal</option>
                <option value="Cómics y Novelas Gráficas">Cómics y Novelas Gráficas</option>
                <option value="Poesía">Poesía</option>
              </select>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="newsCheckbox"
                className="w-5 h-5 border border-black rounded-sm"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
              />
              <label 
                htmlFor="newsCheckbox" 
                className="text-black text-xs font-bold leading-tight"
              >
                Aceptas recibir nuestras noticias y novedades por correo electrónico. 
                Te mantendremos informado sobre productos, promociones y eventos.
              </label>
            </div>

            {error && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
                  <p className="text-sm text-gray-800">{error}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => setError("")}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {onPrevious && (
                <button 
                  type="button"
                  onClick={onPrevious}
                  className="w-1/3 text-white p-2 rounded"
                  style={{ backgroundColor: "#624818" }}
                >
                  Atrás
                </button>
              )}
              <button 
                id="siguiente_registro3" 
                type="submit" 
                className="w-1/3 text-white p-2 rounded ml-auto"
                style={{ backgroundColor: "#624818" }}
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro3;
