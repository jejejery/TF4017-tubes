# Gunakan image Python
FROM python:3.11

# Copy requirements dan file Python ke dalam container
COPY backend/requirements.txt /app/requirements.txt
WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy kode aplikasi
COPY . /app

# Jalankan script Python
CMD ["python", "app.py"]
