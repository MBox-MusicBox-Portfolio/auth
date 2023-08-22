FROM node:18.16.0
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
EXPOSE 4000