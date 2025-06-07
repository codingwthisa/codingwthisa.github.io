import { useLocation, useParams } from "react-router-dom";
import { useState } from "react"; // Asegúrate de importar useState

const ProductPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1); 

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">
          Producto no encontrado. Por favor, regresa al catálogo.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row justify-between bg-gradient-to-br to-gray-100 shadow-2xl rounded-3xl max-w-5xl mx-auto p-8 gap-8 mt-10"
      style={{ backgroundColor: "#DACCB2" }}
    >
      {/* Imagen del producto */}
      <div className="w-full md:w-1/3 flex justify-center items-center bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 transform hover:scale-110">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Detalles */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">{product.name}</h1>
        <p className="text-lg font-semibold text-gray-700 mt-2">
          Autor: <span className="text-gray-900">{product.autor}</span>
        </p>
        <p className="text-gray-600 text-lg">
          Categoría: <span className="italic text-gray-800">{product.categoria}</span>
        </p>
        <p className="text-gray-600 text-lg">
          Editorial: <span className="italic text-gray-800">{product.editorial}</span>
        </p>
        <p className="text-gray-600 text-lg">
          Año: <span className="italic text-gray-800">{product.year}</span>
        </p>
        <p className="text-2xl font-bold text-gray-700 mt-4">${product.price}</p>

        {/* Cantidad y botón */}
        <div className="mt-6 flex flex-col items-center">
          <p className="text-lg font-semibold text-gray-700">Cantidad</p>
          <div className="flex items-center mt-2 border border-gray-300 rounded-xl overflow-hidden bg-white shadow-md">
            <button onClick={decreaseQuantity} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-xl">-</button>
            <span className="px-6 py-2 text-lg font-bold">{quantity}</span>
            <button onClick={increaseQuantity} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-xl">+</button>
          </div>

          <button className="mt-6 px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg w-full md:w-auto hover:bg-blue-600 transition-all transform hover:scale-105">
            🛒 Agregar al carrito
          </button>
        </div>
      </div>

      {/* Descripción */}
      <div
        className="w-full md:w-1/3 bg-white shadow-2xl rounded-2xl p-12"
        style={{ backgroundColor: "#DACCB2" }}
      >
        <h2 className="text-xl font-semibold text-gray-800">Descripción</h2>
        <p className="text-gray-700 mt-2">{product.descripcion}</p>
      </div>
    </div>
  );
};

export default ProductPage;