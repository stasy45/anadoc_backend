FROM node:latest

WORKDIR /anadoc_backend

COPY package*.json ./
RUN npm install

EXPOSE 8000

CMD ["npm", "run", "start:dev"]