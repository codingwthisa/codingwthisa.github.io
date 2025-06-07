import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Inicio() {
  const navigate = useNavigate();
  const [librosApi, setLibrosApi] = useState([]);

  const libros_recomendados = [
    { id: 101, titulo: "Harry Potter y la piedra filosofal", autor: "J. K. Rowling", precio: 39000, imagen: "https://covers.openlibrary.org/b/id/7884863-L.jpg" },
    { id: 102, titulo: "Los juegos del hambre", autor: "Suzanne Collins", precio: 37000, imagen: "https://covers.openlibrary.org/b/id/8231349-L.jpg" },
    { id: 103, titulo: "El código Da Vinci", autor: "Dan Brown", precio: 41000, imagen: "https://covers.openlibrary.org/b/id/8230817-L.jpg" },
    { id: 104, titulo: "El alquimista", autor: "Paulo Coelho", precio: 36000, imagen: "https://covers.openlibrary.org/b/id/8230875-L.jpg" },
    { id: 105, titulo: "Orgullo y prejuicio", autor: "Jane Austen", precio: 35000, imagen: "https://covers.openlibrary.org/b/id/8231135-L.jpg" },
    { id: 106, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", precio: 50000, imagen: "https://covers.openlibrary.org/b/id/8231160-L.jpg" },
    { id: 107, titulo: "El señor de los anillos", autor: "J. R. R. Tolkien", precio: 58000, imagen: "https://covers.openlibrary.org/b/id/8231203-L.jpg" },
    { id: 108, titulo: "Cumbres borrascosas", autor: "Emily Brontë", precio: 39000, imagen: "https://covers.openlibrary.org/b/id/8231291-L.jpg" }
  ];

  const autoresDestacados = [
    { nombre: 'Isabel Allende', imagen: 'https://nuevodiario-assets.s3.us-east-2.amazonaws.com/wp-content/uploads/2021/12/05114633/3.jpg' },
    { nombre: 'Mario Vargas Llosa', imagen: 'https://static1.mujerhoy.com/www/multimedia/202504/14/media/cortadas/vargas-llosa-kObH-U2301463799454lwC-1248x1248@MujerHoy.jpg' },
    { nombre: 'Haruki Murakami', imagen: 'https://media.revistagq.com/photos/61a63d9efe590a137a76124e/master/pass/haruki-murakami.jpg' },
    { nombre: 'J.K. Rowling', imagen: 'https://m.media-amazon.com/images/S/amzn-author-media-prod/8cigckin175jtpsk3gs361r4ss._SY450_CR0%2C0%2C450%2C450_.jpg' },
    { nombre: 'Stephen King', imagen: 'https://s1.abcstatics.com/abc/www/multimedia/play/2025/02/01/Captura-RuUZq66p9WL9Cp4tUsu5RLJ-1200x840@diario_abc.PNG' },
    { nombre: 'Jane Austen', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFKbGCPnFgvs0PK7Qbz8t2tn8Aq62G-Irk_w&s' },
    { nombre: 'Gabriel García Márquez', imagen: 'https://www.biografiasyvidas.com/reportaje/garcia_marquez/fotos/garcia_marquez_420a.jpg' },
    { nombre: 'George Orwell', imagen: 'https://upload.wikimedia.org/wikipedia/commons/8/82/George_Orwell%2C_c._1940_%2841928180381%29.jpg' }
  ];

  useEffect(() => {
    axios.get("http://localhost:8000/api/libros/disponibles/")
      .then((res) => {
        const formateados = res.data.map(libro => ({
          id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          precio: libro.ejemplares?.[0]?.precio || 0,
          imagen: libro.imagen || "https://via.placeholder.com/150x220?text=Libro"
        }));
        setLibrosApi(formateados);
      })
      .catch((err) => console.error("Error al cargar libros desde API:", err));
  }, []);

  const libros_novedad = [...librosApi];

  const agruparEnSlides = (libros) => {
    const slides = [];
    for (let i = 0; i < libros.length; i += 4) {
      slides.push(libros.slice(i, i + 4));
    }
    return slides;
  };

  const renderLibroSlide = (libros) => {
    const slides = agruparEnSlides(libros);
    return (
      <Carousel showThumbs={false} showStatus={false} infiniteLoop emulateTouch showArrows>
        {slides.map((grupo, idx) => (
          <div key={idx} className="flex justify-center gap-4 flex-wrap px-2">
            {grupo.map((libro) => (
              <div key={libro.id} className="bg-white rounded shadow p-4 text-center w-44 sm:w-60">
                <img src={libro.imagen} alt={libro.titulo} className="w-32 h-48 mx-auto object-cover mb-2" />
                <h3 className="text-[#5A4115] font-semibold">{libro.titulo}</h3>
                <p className="text-sm text-gray-600">{libro.autor}</p>
                <p className="text-sm font-bold text-[#5A4115] mt-1">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(libro.precio)}
                </p>
                <button
                  onClick={() => navigate(`/libros/${libro.id}`)}
                  className="mt-2 px-4 py-1 bg-[#5A4115] text-white rounded hover:bg-[#3e2f0d] text-sm"
                >
                  Ver más
                </button>
              </div>
            ))}
          </div>
        ))}
      </Carousel>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-[#5A4115]">
      {/* Carrusel principal */}
      <div className="w-full h-[220px] sm:h-[300px] md:h-[400px] overflow-hidden relative">
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={4000}>
          <div>
            <img
              src="https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/06/05/32466_Billboard_FathersDay_06_03_25.jpg"
              alt="Promoción 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1588580000645-4562a6d2c839?q=80&w=2940&auto=format&fit=crop"
              alt="Promoción 2"
              className="w-full h-full object-cover"
            />
          </div>
        </Carousel>
      </div>

      {/* Novedades */}
      <section className="px-4 sm:px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Novedades</h2>
        {renderLibroSlide(libros_novedad)}
      </section>

      {/* Recomendados */}
      <section className="px-4 sm:px-6 py-10 max-w-6xl mx-auto bg-[#f0e6d2]">
        <h2 className="text-2xl font-bold mb-4">Recomendados</h2>
        {renderLibroSlide(libros_recomendados)}
      </section>

      {/* Autores destacados */}
      <section className="px-4 sm:px-6 py-12 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Autores destacados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {autoresDestacados.map((autor, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/autores/${encodeURIComponent(autor.nombre)}`)}
            >
              <img
                src={autor.imagen}
                alt={autor.nombre}
                className="w-24 h-24 object-cover rounded-full shadow"
              />
              <p className="mt-2 text-sm font-medium">{autor.nombre}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}