import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('password-reset/', { email });
      const { uid, token } = res.data;

      // Redirigir automáticamente al formulario de nueva contraseña
      navigate(`/restablecer/${uid}/${token}`);
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudo generar el enlace. Verifica el correo.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">¿Olvidaste tu contraseña?</h2>
        <p className="text-sm mb-4 text-gray-600 text-center">
          Ingresa tu correo electrónico para restablecer tu contraseña.
        </p>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />

        <button
          type="submit"
          className="w-full bg-[#704c1f] text-white py-2 rounded-lg hover:bg-[#5b3f0b] transition"
        >
          Enviar enlace
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
