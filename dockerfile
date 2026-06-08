FROM node:latest

WORKDIR /anadoc_backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]