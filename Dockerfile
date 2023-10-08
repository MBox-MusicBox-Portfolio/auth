FROM node:18.16.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install  --silence
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]