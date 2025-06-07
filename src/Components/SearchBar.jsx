import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCarrito } from "./CarritoContext";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const debounceTimeout = useRef(null);

  const buscarLibros = async (texto) => {
    try {
      const res = await api.get(`/catalogo/?q=${encodeURIComponent(texto)}`);
      setResultados(res.data.results || []);
      setShowResults(true);
    } catch (err) {
      console.error("Error al buscar libros:", err);
      setResultados([]);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (query.trim().length === 0) {
      setResultados([]);
      setShowResults(false);
      return;
    }
    debounceTimeout.current = setTimeout(() => {
      buscarLibros(query);
    }, 400);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (libroId) => {
    navigate(`/libros/${libroId}`);
    setShowResults(false);
    setQuery("");
  };

  const handleAddToCart = async (ejemplarId, e) => {
    e.stopPropagation();
    if (!ejemplarId) return;
  
    try {
      await agregarAlCarrito(ejemplarId); // ✅ usa el contexto
      setShowResults(false);
      setQuery("");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/catalogo?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      {/* Barra de búsqueda */}
      <div className="flex shadow rounded overflow-hidden bg-[#704c1f]">
        <input
          type="text"
          placeholder="Busca por título o autor..."
          className="flex-1 px-4 py-2 bg-transparent text-white placeholder-white focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
        <button className="px-4 text-white hover:bg-[#5a3c18]">
          <Search size={18} />
        </button>
      </div>

      {/* Resultados */}
      {showResults && (
        <div className="absolute w-full bg-white mt-2 rounded-md shadow-xl z-50 p-4">
          {resultados.length > 0 ? (
            <>
              <h3 className="text-sm font-semibold mb-2 text-[#5A4115]">PRODUCTOS PARA "{query}"</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {resultados.slice(0, 3).map((libro) => (
                  <div
                    key={libro.id}
                    className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-3 rounded"
                    onClick={() => handleResultClick(libro.id)}
                  >
                    <img
                      src={libro.imagen || "https://via.placeholder.com/80x120"}
                      alt={libro.titulo}
                      className="w-20 h-28 object-cover rounded mb-2"
                    />
                    <div className="text-sm font-semibold text-center text-[#5A4115]">{libro.titulo}</div>
                    <div className="text-xs text-gray-600 text-center">{libro.autor}</div>
                    <div className="text-sm font-bold text-green-700">
                      ${parseFloat(libro.ejemplares?.[0]?.precio || 0).toLocaleString("es-CO")}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(libro.ejemplares?.[0]?.id, e)}
                      className="mt-2 bg-[#704c1f] text-white text-sm px-3 py-1 rounded hover:bg-[#5a3c18]"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-center mt-3 text-sm">
                <button
                  onClick={() => {
                    navigate(`/catalogo?q=${encodeURIComponent(query)}`);
                    setShowResults(false);
                  }}
                  className="text-[#704c1f] hover:underline"
                >
                  Ver todos los {resultados.length} resultados
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-6">No se encontraron resultados</div>
          )}
        </div>
      )}
    </div>
  );
}