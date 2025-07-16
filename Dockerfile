FROM node:20

WORKDIR /app

# Chỉ copy file package trước để cache layer npm install
COPY package*.json ./
RUN apt-get update && apt-get install -y python3 make g++
RUN npm install

# Sau đó mới copy toàn bộ code
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]