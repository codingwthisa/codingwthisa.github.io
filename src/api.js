import axios from 'axios';

// Crea una instancia de axios con la configuración básica
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // URL base del backend de Django
  headers: {
    'Content-Type': 'application/json',    // Asegura que las peticiones sean en formato JSON
  },
});

// Interceptores de peticiones (opcional pero recomendado)
api.interceptors.request.use(
  (config) => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem("token");
    console.log("🔐 Enviando token:", token);
    
    // Si el token existe, agregarlo a las cabeceras de la petición
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;  // Retorna la configuración de la petición
  },
  (error) => {
    return Promise.reject(error);  // Maneja cualquier error antes de enviar la petición
  }
);

// Interceptores de respuestas (opcional)
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente retornarla
    return response;
  },
  (error) => {
    // Aquí puedes manejar errores globales, como redireccionar si el token expira
    if (error.response.status === 401) {
      console.log('Token expirado o no válido. Redirigiendo al login.');
      // Redirigir al login o manejar el error según el caso
    }
    return Promise.reject(error);  // Rechaza cualquier error en la respuesta
  }
);

export default api;  // Exporta la instancia configurada de Axiossisa