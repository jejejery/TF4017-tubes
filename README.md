
<div align="center">
    <a href="https://github.com/jejejery/TF4017-tubes">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwPIuu6ZVB7ePVp_J355mL2egDnh3hJ3AG0g&s"/>
    </a>
    <h3 align="center">Tugas Besar TF4017 - Industrial Internet of Things (IIOT) </h3>
</div>

Repository ini dibuat untuk memenuhi tugas besar TF4017 - Industrial Internet of Things (IIOT)

## Table of Contents
1. [Deskripsi Sistem](#deskripsi-sistem)
2. [Tech Stack](#tech-stack)
3. [Cara Menjalankan](#cara-menjalankan)
4. [Video Capture](#video-capture)
5. [Anggota & Pembagian Tugas](#pembagian-tugas)

<a name="deskripsi-sistem"></a>

# Deskripsi Sistem

Tujuan dari tugas ini adalah merancang sistem desain database IoT yang terintegrasi untuk Kit Sistem Pengukuran Suhu dengan memanfaatkan komponen modern seperti `PLC, HMI, Docker, Script Python, ReactJS, dan InfluxDB`. Sistem ini dirancang untuk menggantikan `Node-Red` dengan `ReactJS` sebagai antarmuka pengguna, memberikan fleksibilitas dan pengalaman yang lebih interaktif. Selain itu, `PostgreSQL` akan digantikan oleh `InfluxDB` untuk mengoptimalkan pengelolaan data time-series yang lebih efisien.

<a name="tech-stack"></a>

# Tech Stacks
- Docker
- Mosquito
- InfluxDB
- Python
- ReactJS
- EasyBuilder
- CS Programmer
- Tailwind CSS

<a name="cara-menjalankan"></a>

# Cara Menjalankan

## 1. Persiapan Awal
- Pastikan Anda sudah menginstal **Docker** di komputer Anda. Jika belum, silakan unduh dan instal dari [sini](https://www.docker.com/).
- Clone repository ini ke komputer Anda dengan perintah berikut:
  ```bash
  git clone https://github.com/jejejery/TF4017-tubes.git
  ```
- Navigasi ke direktori proyek dengan perintah:
  ```bash
  cd TF4017-tubes
  ```
## 2. Konfigurasi Docker
- Pastikan semua file yang diperlukan untuk Docker telah tersedia, termasuk `docker-compose.yml`
- Apabila terdapat konfigurasi tambah (misalnya, kredensial atau port), sesuaikan file konfigurasi sebelum menjalankan sistem.
## 3. Menjalankan Sistem
- Jalankan perintah berikut pada terminal untuk membangun dan menjalankan layanan:
```bash
docker-compose up --build
```
## 4. Akses sistem
- Setiap layanan yang telah dijalankan dapat diakses pada `port` tertentu sesuai dengan definisi pada `docker-compose.yml`


<a name="video-capture"></a>

# Video Capture
<nl>

![Temperature Monitoring System Gif](https://github.com/jejejery/TF4017-tubes/blob/main/TemperatureMonitoringSystem.gif?raw=true)

<a name="pembagian-tugas"></a>

# Anggota & Pembagian Tugas

|Nama|NIM|Pembagian Tugas|
|----|-------|------|
|Christoporus Nicholas | 13321001 | PLC | 
|Achriza Nurfarid | 13321023 | PLC | 
|Hero Hafizuddin Rahman | 13321055 | Wiring | 
|Nico Oktavianto Aritonang | 13221088 | Wiring |
|Shidqi Indy Izhari | 13521097 | HMI |  
|Jeremya Dharmawan Raharjo | 13521131 | Backend | 
|Mohammad Rifqi Farhansyah | 13521166 | Front-end |  
