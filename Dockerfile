FROM node:19-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]