import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Heart, User } from 'lucide-react';
import Carrito, { CartButton } from "./Carrito";
import { useCarrito } from "./CarritoContext";
import SearchBar from './SearchBar';

const logo = './Login/LOGO.png';

const ficcion = [
  "Colombiana", "Cómics", "Crítica Literaria", "Fantástica y Ciencia Ficción",
  "Literatura Infantil", "Juvenil", "Latinoamericana", "Universal",
  "Novela Histórica", "Poesía", "Policíaca", "Romántica", "Suspenso y Terror"
];

const noFiccion = [
  "Arte", "Autoayuda y Superación", "Biografías y Autobiografías",
  "Ciencias y Divulgación Científica", "Cine", "Diccionarios", "Espiritualidad",
  "Fotografía", "Gastronomía", "Música", "Teatro", "Administración", "Arquitectura",
  "Contabilidad", "Derecho", "Educación", "Filosofía", "Historia Universal",
  "Liderazgo", "Marketing", "Matemáticas"
];

const Header = () => {
  const navigate = useNavigate();
  const usuarioLogueado = localStorage.getItem('usuario');
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const menuRef = useRef(null);
  const { cantidadCarrito } = useCarrito();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("usuario");
    setMostrarMenu(false);
    navigate("/login");
  };

  const irACategoria = (categoria) => {
    navigate(`/catalogo/categoria/${encodeURIComponent(categoria)}`);
  };

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  return (
    <header className="bg-[#f5efe3] border-b border-[#ccb99d] shadow-sm w-full">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3 gap-2 flex-wrap sm:flex-nowrap">
        {/* Logo */}
        <div className="shrink-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo HQ" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Búsqueda */}
        <div className="flex-1 min-w-[200px]">
          <SearchBar />
        </div>

        {/* Íconos */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:block text-sm">Tiendas Físicas</span>
          <Heart className="cursor-pointer text-[#2d1e0a] hover:text-red-600" />
          <div className="relative" ref={menuRef}>
            <User
              className="cursor-pointer text-[#2d1e0a] hover:text-[#1a1208]"
              onClick={() => {
                const stored = localStorage.getItem("usuario");
                if (!stored) {
                  navigate("/login");
                } else {
                  setMostrarMenu(!mostrarMenu);
                }
              }}
            />
            {mostrarMenu && usuarioLogueado && (
              <div className="absolute right-0 top-10 bg-white text-[#5A4115] rounded-md shadow-lg z-50 text-sm w-48 animate-fade-in">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    const usuario = JSON.parse(localStorage.getItem("usuario"));
                    const rol = usuario?.rol?.toLowerCase();
                    if (rol === "cliente") {
                      navigate("/editar-perfil");
                    } else if (rol === "administrador") {
                      navigate("/adminpanel");
                    }
                    setMostrarMenu(false);
                  }}
                >
                  Mi perfil
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate('/mensajeria');
                    setMostrarMenu(false);
                  }}
                >
                  Soporte
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
          <CartButton count={cantidadCarrito} onClick={() => setOpenCart(true)} />
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-[#5b3f0b] text-white px-4 py-2 flex gap-6 text-sm font-medium flex-wrap">
        {[{ nombre: 'Ficción', categorias: ficcion }, { nombre: 'No Ficción', categorias: noFiccion }].map((grupo, i) => (
          <div key={i} className="relative group cursor-pointer">
            <div className="flex items-center gap-1 hover:text-yellow-300 transition">
              {grupo.nombre} <ChevronDown size={14} />
            </div>
            <div className={`absolute left-0 top-full bg-white text-[#5b3f0b] shadow-lg rounded-md p-4 ${grupo.nombre === 'Ficción' ? 'w-[600px]' : 'w-[900px]'} hidden group-hover:flex flex-wrap z-50`}>
              {Array(3).fill().map((_, colIndex) => (
                <div key={colIndex} className="w-1/3">
                  <ul className={`space-y-1 text-sm ${colIndex > 0 ? 'mt-8' : ''}`}>
                    {grupo.categorias
                      .filter((_, i) => i % 3 === colIndex)
                      .map((cat, idx) => (
                        <li
                          key={idx}
                          className="hover:underline hover:text-[#704c1f] cursor-pointer transition"
                          onClick={() => irACategoria(cat)}
                        >
                          {cat}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Carrito open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
};

export default Header;