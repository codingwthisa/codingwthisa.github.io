import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await api.post('password-reset-confirm/', {
        uid,
        token,
        password,
      });
      setMensaje('¡Contraseña restablecida exitosamente!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError('El enlace es inválido o ha expirado.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer Contraseña</h2>
        <p className="text-sm mb-4 text-gray-600 text-center">
          Ingresa tu nueva contraseña.
        </p>

        {mensaje && <p className="text-green-600 mb-4 text-sm">{mensaje}</p>}
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <button
          type="submit"
          className="w-full bg-[#704c1f] text-white py-2 rounded-lg hover:bg-[#5b3f0b] transition"
        >
          Guardar nueva contraseña
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
