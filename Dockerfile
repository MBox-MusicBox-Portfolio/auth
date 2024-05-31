FROM node:20-alpine
WORKDIR /usr/src/app/auth
COPY . ./
RUN ["npm", "install"]
EXPOSE 8000