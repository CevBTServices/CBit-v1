FROM nginx:alpine

# Statik dosyaları Nginx varsayılan yayın dizinine kopyala
COPY . /usr/share/nginx/html

# Port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
