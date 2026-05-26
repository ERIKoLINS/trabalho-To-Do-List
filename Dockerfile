# ==========================================
# ESTÁGIO 1: Construção (A Cozinha)
# ==========================================
# 1. Usamos uma imagem pesada do Node.js para compilar o projeto
FROM node:20-alpine AS builder

# 2. Definimos a pasta de trabalho dentro do container
WORKDIR /app

# 3. Copiamos apenas os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package.json package-lock.json ./

# 4. Instalamos as dependências
RUN npm install

# 5. Copiamos o resto do código da nossa aplicação
COPY . .

# 6. Rodamos o build do Vite (Isso vai gerar uma pasta /app/dist com o código minificado)
RUN npm run build

# ==========================================
# ESTÁGIO 2: Produção (A Vitrine)
# ==========================================
# 7. Iniciamos uma nova imagem, agora usando o NGINX (um servidor web ultraleve)
FROM nginx:alpine

# 8. Copiamos APENAS a pasta "dist" do Estágio 1 para a pasta pública do NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# 9. Expomos a porta padrão do NGINX
EXPOSE 80

# 10. Comando para manter o NGINX rodando
CMD ["nginx", "-g", "daemon off;"]