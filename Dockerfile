FROM node:latest as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest
COPY --from=builder /app/dist/photoboof /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl/ngdev.crt /etc/ssl/certs/
COPY ssl/ngdev.key /etc/ssl/private/
EXPOSE 443
