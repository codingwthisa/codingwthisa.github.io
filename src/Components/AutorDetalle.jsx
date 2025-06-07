import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from "../api";

const autoresData = {
    "Isabel Allende": {
      descripcion: "Escritora chilena reconocida por sus novelas históricas y realismo mágico.",
      imagen: "https://nuevodiario-assets.s3.us-east-2.amazonaws.com/wp-content/uploads/2021/12/05114633/3.jpg"
    },
    "Mario Vargas Llosa": {
      descripcion: "Premio Nobel de Literatura y una de las figuras más destacadas de la narrativa latinoamericana.",
      imagen: "https://static1.mujerhoy.com/www/multimedia/202504/14/media/cortadas/vargas-llosa-kObH-U2301463799454lwC-1248x1248@MujerHoy.jpg"
    },
    "Haruki Murakami": {
      descripcion: "Novelista japonés conocido por su estilo surrealista y temas de soledad.",
      imagen: "https://media.revistagq.com/photos/61a63d9efe590a137a76124e/master/pass/haruki-murakami.jpg"
    },
    "J.K. Rowling": {
      descripcion: "Autora británica conocida mundialmente por la saga de Harry Potter.",
      imagen: "https://m.media-amazon.com/images/S/amzn-author-media-prod/8cigckin175jtpsk3gs361r4ss._SY450_CR0%2C0%2C450%2C450_.jpg"
    },
    "Stephen King": {
      descripcion: "Maestro del terror y autor prolífico de novelas de horror, fantasía y suspenso.",
      imagen: "https://s1.abcstatics.com/abc/www/multimedia/play/2025/02/01/Captura-RuUZq66p9WL9Cp4tUsu5RLJ-1200x840@diario_abc.PNG"
    },
    "Jane Austen": {
      descripcion: "Autora inglesa del siglo XIX conocida por sus novelas románticas e irónicas.",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFKbGCPnFgvs0PK7Qbz8t2tn8Aq62G-Irk_w&s"
    },
    "Gabriel García Márquez": {
      descripcion: "Uno de los más grandes exponentes del realismo mágico. Nobel de Literatura.",
      imagen: "https://www.biografiasyvidas.com/reportaje/garcia_marquez/fotos/garcia_marquez_420a.jpg"
    },
    "George Orwell": {
      descripcion: "Ensayista, novelista y periodista británico. Autor de '1984' y 'Rebelión en la granja'.",
      imagen: "https://upload.wikimedia.org/wikipedia/commons/8/82/George_Orwell%2C_c._1940_%2841928180381%29.jpg"
    },
  };

export default function AutorDetalle() {
  const { nombre } = useParams();
  const nombreDecodificado = decodeURIComponent(nombre);
  const autor = autoresData[nombreDecodificado];
  const [relacionados, setRelacionados] = useState([]);

  useEffect(() => {
    api.get("libros/disponibles/")
      .then(res => {
        const librosRelacionados = res.data.filter((libro) =>
          libro.autor.toLowerCase().includes(nombreDecodificado.toLowerCase())
        );
        setRelacionados(librosRelacionados);
      })
      .catch(err => console.error("Error cargando libros relacionados:", err));
  }, [nombreDecodificado]);

  if (!autor) {
    return <p className="text-center text-red-600 mt-10">Autor no encontrado.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center gap-6 mb-10">
        <img src={autor.imagen} alt={nombreDecodificado} className="w-40 h-40 object-cover rounded-full shadow" />
        <div>
          <h1 className="text-3xl font-bold text-[#5A4115] mb-2">{nombreDecodificado}</h1>
          <p className="text-gray-700">{autor.descripcion}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-[#5A4115] mb-4">Libros de {nombreDecodificado}</h2>
      {relacionados.length === 0 ? (
        <p className="text-gray-500">No hay libros registrados de este autor.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relacionados.map((libro) => (
            <div key={libro.id} className="bg-white rounded shadow p-4">
              <img src={libro.imagen} alt={libro.titulo} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold text-[#5A4115]">{libro.titulo}</h3>
              <p className="text-sm text-gray-600">{libro.autor}</p>
              <p className="text-sm font-bold text-[#5A4115] mt-1">${libro.ejemplares?.[0]?.precio?.toLocaleString() || 'N/A'} COP</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}