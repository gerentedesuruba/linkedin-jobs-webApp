# Usar uma imagem base do Nginx
FROM nginx:alpine

# Copiar primeiro os arquivos estáticos do frontend
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Agora, copiar o nosso arquivo de configuração personalizado para o local correto dentro do container
COPY nginx.conf /etc/nginx/nginx.conf

# Não é necessário expor a porta aqui, pois o docker-compose cuidará disso.
