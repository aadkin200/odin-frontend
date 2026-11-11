FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build
FROM nginx:1.29-alpine
COPY --from=build /app/dist/odins-chosen-angular/browser/ /usr/share/nginx/html/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_UPSTREAM=http://127.0.0.1:9999
ENV NGINX_ENVSUBST_FILTER=BACKEND_UPSTREAM
EXPOSE 8080
