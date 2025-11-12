FROM node:18-alpine

# diretório do app
WORKDIR /usr/src/app

# copia package.json e package-lock.json (se existir)
COPY package*.json ./

# instala dependências de forma reproduzível
RUN npm ci || npm install

# copia o restante do código
COPY . .

# expõe a porta (usa PORT=3000 por padrão)
EXPOSE 3000

# comando de start
CMD ["npm", "start"]
