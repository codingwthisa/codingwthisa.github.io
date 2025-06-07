# Usa una imagen oficial de Node con Alpine Linux para un contenedor liviano
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Construye la aplicación para producción (esto crea la carpeta "dist")
RUN npm run build

# Instala el paquete "serve" globalmente para servir la aplicación estática
RUN npm install -g serve

# Expone el puerto en el que se ejecutará la aplicación (por ejemplo, 3000)
EXPOSE 3000

# Comando por defecto: sirve la carpeta "dist" en el puerto 3000
CMD ["serve", "-s", "dist", "-l", "3000"]