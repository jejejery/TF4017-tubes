# Gunakan image node.js
FROM node:20

# Set direktori kerja
WORKDIR /app

# Salin file package.json dan package-lock.json saja
COPY package*.json ./

# Hapus cache NPM dan install dependensi
RUN npm cache clean --force && npm install

# Salin seluruh file proyek
COPY . .

# Jalankan Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]