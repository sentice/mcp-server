FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
