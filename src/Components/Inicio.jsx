import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Inicio() {
  const navigate = useNavigate();
  const [librosApi, setLibrosApi] = useState([]);

  // const libros_novedad_estaticos = [
  //   { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", precio: 45000, imagen: "https://covers.openlibrary.org/b/id/7984916-L.jpg" },
  //   { id: 2, titulo: "1984", autor: "George Orwell", precio: 38000, imagen: "https://covers.openlibrary.org/b/id/1535411-L.jpg" },
  //   { id: 3, titulo: "Sapiens", autor: "Yuval Noah Harari", precio: 52000, imagen: "https://covers.openlibrary.org/b/id/8164814-L.jpg" },
  //   { id: 4, titulo: "El amor en los tiempos del cólera", autor: "Gabriel García Márquez", precio: 46000, imagen: "https://covers.openlibrary.org/b/id/8231850-L.jpg" },
  //   { id: 5, titulo: "Rayuela", autor: "Julio Cortázar", precio: 47000, imagen: "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
  //   { id: 6, titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón", precio: 43000, imagen: "https://covers.openlibrary.org/b/id/8159996-L.jpg" },
  //   { id: 7, titulo: "El nombre del viento", autor: "Patrick Rothfuss", precio: 48000, imagen: "https://covers.openlibrary.org/b/id/8231882-L.jpg" },
  //   { id: 8, titulo: "Fahrenheit 451", autor: "Ray Bradbury", precio: 40000, imagen: "https://covers.openlibrary.org/b/id/8235044-L.jpg" }
  // ];

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
          <div key={idx} className="flex justify-center gap-6 py-4 flex-wrap">
            {grupo.map((libro) => (
              <div key={libro.id} className="bg-white rounded shadow p-4 text-center w-60">
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
      <div className="w-full h-[400px] overflow-hidden relative">
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={4000}>
        <div>
          <img
            src="https://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/06/05/32466_Billboard_FathersDay_06_03_25.jpg"
            alt="Promoción 1"
            className="w-full h-[400px] object-cover"
          />
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1588580000645-4562a6d2c839?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Promoción 2"
            className="w-full h-[400px] object-cover"
          />
        </div>
      </Carousel>
    </div>

      {/* Novedades */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Novedades</h2>
        {renderLibroSlide(libros_novedad)}
      </section>

      {/* Recomendados */}
      <section className="px-6 py-10 max-w-7xl mx-auto bg-[#f0e6d2]">
        <h2 className="text-2xl font-bold mb-4">Recomendados</h2>
        {renderLibroSlide(libros_recomendados)}
      </section>

      {/* Autores destacados */}
      <section className="px-6 py-12 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Autores destacados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {autoresDestacados.map((autor, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/autores/${encodeURIComponent(autor.nombre)}`)}
            >
              <img
                src={autor.imagen}
                alt={autor.nombre}
                className="w-28 h-28 object-cover rounded-full shadow"
              />
              <p className="mt-2 text-sm font-medium">{autor.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Imagen promocional */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
          <img src="https://gandhi.vtexassets.com/assets/vtex.file-manager-graphql/images/e4777391-438c-42eb-9962-ca2237915169___00cd61f0c0e7f4a799ab6f0c89610252.jpg" alt="Promoción especial" className="w-full h-auto object-cover" />
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="px-6 py-12 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Categorías destacadas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { nombre: 'Ficción', icono: '📖' },
            { nombre: 'No Ficción', icono: '📘' },
            { nombre: 'Juvenil', icono: '🧒' },
            { nombre: 'Infantil', icono: '🧸' },
            { nombre: 'Cómics', icono: '💥' },
            { nombre: 'Autoayuda', icono: '🧠' },
            { nombre: 'Historia', icono: '🏛️' },
            { nombre: 'Ciencia', icono: '🔬' },
          ].map((categoria, idx) => (
            <div key={idx} className="flex flex-col items-center transition duration-300 hover:scale-105 hover:shadow-lg">
              <div className="w-28 h-28 rounded-full bg-white shadow flex items-center justify-center text-4xl">
                <span>{categoria.icono}</span>
              </div>
              <p className="mt-2 text-sm font-medium">{categoria.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mapa de ubicaciones */}
      <section className="px-6 py-12 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Nuestras ubicaciones en Pereira</h2>
        <div className="rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Mapa ubicaciones HQ Library"
            src="https://www.google.com/maps/d/u/0/embed?mid=1jv2w-pfklOxGzEWiJvYUT-_oH0rqJuY&ehbc=2E312F"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="w-full border-none rounded-md"
          ></iframe>
        </div>
      </section>
    </div>
  );
}