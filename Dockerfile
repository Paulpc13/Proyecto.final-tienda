# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine
# Copiamos los archivos estáticos generados por Vite (por defecto en /dist)
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos una configuración mínima para manejar rutas de SPA si fuera necesario
# RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
