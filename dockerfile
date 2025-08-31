FROM node:18-slim

# Instalar dependencias del sistema y LibreOffice
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
