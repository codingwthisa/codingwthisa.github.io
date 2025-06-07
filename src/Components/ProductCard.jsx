import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCarrito } from "../Components/CarritoContext";
import { toast } from "react-toastify"; 

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();  
  console.log("agregarAlCarrito cargado:", typeof agregarAlCarrito === "function");

  const handleViewMore = () => {
    navigate(`/producto/${product.id}`, { state: { product } });
  };

  
  console.log("Tipo de agregarAlCarrito:", typeof agregarAlCarrito);
  const handleAddToCart = async () => {
    try {
      const ejemplarId = product.ejemplares?.[0]?.id;
      if (!ejemplarId) {
        toast.warn("Este libro no tiene ejemplares disponibles.");
        return;
      }
  
      await agregarAlCarrito(ejemplarId);
      toast.success("Libro agregado al carrito 🎉");
    } catch (error) {
      toast.error("No se pudo agregar al carrito.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg border border-gray-300 flex flex-col items-center w-full bg-white">
      <img
        src={product.imagen || "https://via.placeholder.com/200x300?text=Sin+Imagen"}
        alt={product.titulo}
        className="w-40 h-60 object-cover rounded border"
      />
      <h2 className="text-lg font-semibold mt-4 text-center text-[#5A4115]">{product.titulo}</h2>
      <p className="text-sm text-gray-600 mb-2 text-center">{product.autor}</p>
      <p className="text-[#5A4115] font-bold">
        ${parseInt(product.ejemplares?.[0]?.precio || 0).toLocaleString("es-CO")} COP
      </p>

      <div className="mt-4 flex flex-col items-center gap-2 w-full">
        <button
          type="button"
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          Añadir al carrito
        </button>
        <button
          onClick={handleViewMore}
          className="bg-gray-200 text-[#5A4115] px-4 py-2 rounded w-full hover:bg-gray-300 transition"
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default ProductCard;