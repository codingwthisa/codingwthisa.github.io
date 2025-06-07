import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("login/", { email, password });

      const { access, refresh, user } = res.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("usuario", JSON.stringify(user));

      switch (user.rol) {
        case "root":
          navigate("/root");
          break;
        case "administrador":
          navigate("/admin-panel");
          break;
        case "cliente":
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#5A4115]">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
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

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5A4115] focus:outline-none mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5A4115] focus:outline-none mb-6"
        />

        <button
          type="submit"
          className="w-full bg-[#5A4115] text-white py-2 rounded-md hover:bg-[#3e2f0d] transition-colors duration-200 font-semibold"
        >
          Ingresar
        </button>

        <p className="text-sm text-center mt-5">
          ¿No tienes una cuenta?{" "}
          <span
            className="text-[#5A4115] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/registro")}
          >
            Regístrate aquí
          </span>
        </p>
      </form>
    </div>
  );
}