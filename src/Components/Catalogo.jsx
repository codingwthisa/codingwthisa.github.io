import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

export default function Catalogo() {
  const { categoria } = useParams();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const [libros, setLibros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const categoriaDecodificada = decodeURIComponent(categoria || '');
    const fetchLibros = async () => {
      try {
        let res;
        if (q) {
          res = await api.get(`/catalogo/?q=${encodeURIComponent(q)}`);
          setTitulo(`Resultados de búsqueda para: "${q}"`);
        } else if (categoria) {
          res = await api.get(`/catalogo/?genero=${encodeURIComponent(categoriaDecodificada)}`);
          setTitulo(`Categoría: ${categoriaDecodificada}`);
        } else {
          res = await api.get(`/catalogo/`);
          setTitulo("Todos los libros disponibles");
        }
        setLibros(res.data.results || []);
      } catch (err) {
        console.error('Error cargando libros del catálogo:', err);
      }
    };

    fetchLibros();
  }, [categoria, q]);

  return (
    <div className="min-h-screen bg-[#f8f6f0] px-6 py-12 text-[#5A4115]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">{titulo}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {libros.map(libro => (
            <div key={libro.id} className="bg-white rounded shadow p-4 flex flex-col justify-between">
              <img
                src={libro.imagen || 'https://via.placeholder.com/200x300'}
                alt={libro.titulo}
                className="w-full h-64 object-cover rounded mb-4"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-1">{libro.titulo}</h2>
                  <p className="text-sm text-gray-600 mb-2">{libro.autor}</p>
                  <p className="text-[#5A4115] font-bold mb-4">
                    ${parseFloat(libro.ejemplares?.[0]?.precio || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/libros/${libro.id}`)}
                  className="bg-[#704c1f] hover:bg-[#5a3c18] text-white py-2 rounded mt-auto"
                >
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}