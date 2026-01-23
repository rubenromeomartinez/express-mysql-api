FROM node:18-alpine

WORKDIR /usr/src/app

# Solo instalamos express para servir el contenido estático
COPY package*.json ./
RUN npm install express

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]