FROM node:20-alpine
WORKDIR /usr/src/app/auth
#COPY . ./
#RUN ["npm", "install"]
#EXPOSE 4000

# Рабочая директория
#WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Компилируем TypeScript
RUN npm run build

# Команда для запуска приложения
#CMD ["npm",  "start"]