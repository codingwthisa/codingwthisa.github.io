import React, { useState, useEffect } from "react";
import products from "../data/products";

const Filtros = ({ onFilterChange }) => {
  const [categorias, setCategorias] = useState([]);
  const [autores, setAutores] = useState([]);
  const [years, setYears] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [editorial, setEditorial] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setCategorias([...new Set(products.map((p) => p.categoria))]);
      setAutores([...new Set(products.map((p) => p.autor))]);
      setYears([...new Set(products.map((p) => p.year))]);
      setPrecios([...new Set(products.map((p) => p.price))]);
      setEditorial([...new Set(products.map((p) => p.editorial))]);
    }
  }, []);

  return (
    <div className="w-full bg-[#624818] py-2 px-6 flex flex-wrap gap-4 text-white">
      {/* Categoría */}
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("categoria", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Género</option>
        {categorias.map((categoria) => (
          <option key={categoria} className="bg-[#DACCB2] text-black">
            {categoria}
          </option>
        ))}
      </select>

      {/* Autor */}
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("autor", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Autor</option>
        {autores.map((autor) => (
          <option key={autor} className="bg-[#DACCB2] text-black">
            {autor}
          </option>
        ))}
      </select>

      {/* Año */}
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("year", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Año</option>
        {years.map((year) => (
          <option key={year} className="bg-[#DACCB2] text-black">
            {year}
          </option>
        ))}
      </select>

      {/* Precio */}
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("price", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Precio</option>
        {precios.map((precio) => (
          <option key={precio} className="bg-[#DACCB2] text-black">
            ${precio}
          </option>
        ))}
      </select>

            {/* Editorial */}
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("editorial", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Editorial</option>
        {editorial.map((editorial) => (
          <option key={editorial} className="bg-[#DACCB2] text-black">
            {editorial}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filtros;





















/*
import React, { useState, useEffect } from "react";
import products from "../data/products";

const Filtros = ({ onFilterChange }) => {
  const [categorias, setCategorias] = useState([]);
  const [autores, setAutores] = useState([]);
  const [years, setYears] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [editorial, setEditorial] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setCategorias([...new Set(products.map((p) => p.categoria))]);
      setAutores([...new Set(products.map((p) => p.autor))]);
      setYears([...new Set(products.map((p) => p.year))]);
      setPrecios([...new Set(products.map((p) => p.price))]);
      setEditorial([...new Set(products.map((p) => p.editorial))]);
    }
  }, []);

  return (
    <div className="w-full bg-[#624818] py-2 px-6 flex flex-wrap gap-4 text-white">
      
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("categoria", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Género</option>
        {categorias.map((categoria) => (
          <option key={categoria} className="bg-[#DACCB2] text-black">
            {categoria}
          </option>
        ))}
      </select>

      
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("autor", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Autor</option>
        {autores.map((autor) => (
          <option key={autor} className="bg-[#DACCB2] text-black">
            {autor}
          </option>
        ))}
      </select>

      
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("year", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Año</option>
        {years.map((year) => (
          <option key={year} className="bg-[#DACCB2] text-black">
            {year}
          </option>
        ))}
      </select>

      
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("price", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Precio</option>
        {precios.map((precio) => (
          <option key={precio} className="bg-[#DACCB2] text-black">
            ${precio}
          </option>
        ))}
      </select>

            
      <select
        className="bg-transparent text-black rounded px-4 py-1"
        onChange={(e) => onFilterChange("editorial", e.target.value)}
      >
        <option className="bg-[#DACCB2] text-black">Editorial</option>
        {editorial.map((editorial) => (
          <option key={editorial} className="bg-[#DACCB2] text-black">
            {editorial}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filtros;

*/