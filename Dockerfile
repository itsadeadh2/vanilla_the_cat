FROM node:8.10

WORKDIR /app

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD ["npm", "run", "dev"]