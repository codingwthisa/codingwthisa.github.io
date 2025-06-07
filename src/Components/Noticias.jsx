import React, { useEffect, useState } from "react";
import api from "../api"; // asegúrate de que apunta al archivo con configuración de axios

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [puedeVer, setPuedeVer] = useState(null); // null = en carga, true = sí, false = no
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSuscripcionYTraerNoticias = async () => {
      try {
        const perfil = await api.get("/perfil/");
        if (perfil.data.recibir_noticias) {
          setPuedeVer(true);
          const resNoticias = await api.get("/noticias/");
          setNoticias(resNoticias.data);
        } else {
          setPuedeVer(false);
        }
      } catch (err) {
        console.error("Error al obtener perfil o noticias", err);
        setPuedeVer(false);
      } finally {
        setLoading(false);
      }
    };

    verificarSuscripcionYTraerNoticias();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-600">Cargando...</div>;

  if (puedeVer === false) {
    return (
      <div className="text-center mt-10 text-gray-700 text-lg">
        No estás suscrito para recibir noticias.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#5A4115] text-center">Noticias y Novedades</h1>
      {noticias.length === 0 ? (
        <p className="text-center text-gray-500">No hay noticias disponibles.</p>
      ) : (
        <div className="space-y-6">
          {noticias.map((noticia) => (
            <div key={noticia.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-[#5A4115]">{noticia.titulo}</h2>
              <p className="text-sm text-gray-500">
                {noticia.autor} &middot; {noticia.genero}
              </p>
              <p className="mt-2 text-gray-700">
                Publicado el {new Date(noticia.fecha_creacion).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}