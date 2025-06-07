const AutoresCard = ({ autor, onViewMore }) => {
    return (
      <div className="p-8 rounded-full shadow-lg border-3 flex flex-col items-center w-full transition-transform duration-300 transform hover:scale-110 cursor-pointer border-black">
        <img
          src={autor.image}
          alt={autor.nombre}
          className="w-40 h-40 object-cover rounded-full border-2 border-gray-800"
        />
        <h4 className="text-lg font-bold mt-2">{autor.nombre}</h4>
  
      </div>
    );
  };
  
  export default AutoresCard;