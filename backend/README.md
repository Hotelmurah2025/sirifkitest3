# Extranet Hotel - Backend API

Backend API untuk aplikasi Extranet Hotel menggunakan Node.js, Express, dan MongoDB (in-memory).

## Teknologi yang Digunakan

- Node.js & Express.js
- MongoDB (in-memory untuk pengembangan)
- JWT untuk autentikasi
- Multer untuk upload file
- Bcrypt untuk enkripsi password

## Struktur Database

- **users**: Pengguna sistem dengan role admin, owner, atau staff
- **hotels**: Data properti hotel
- **rooms**: Jenis kamar di hotel
- **availability**: Ketersediaan dan harga kamar per tanggal
- **reservations**: Pemesanan kamar
- **promotions**: Promosi dan diskon
- **transactions**: Transaksi pembayaran
- **bank_accounts**: Rekening bank hotel

## Fitur Utama

- Sistem autentikasi multi-user dengan JWT
- Manajemen properti hotel
- Manajemen kamar dan harga
- Kalender ketersediaan kamar
- Sistem reservasi
- Manajemen promosi
- Laporan keuangan
- Upload file (gambar dan CSV)

## Instalasi dan Penggunaan

1. Install dependencies:
   ```
   npm install
   ```

2. Buat file .env (sudah disediakan dengan konfigurasi default)

3. Jalankan server:
   ```
   npm run dev
   ```

4. Server akan berjalan di http://localhost:8000

## Catatan Penting

- Database menggunakan MongoDB in-memory, sehingga data akan hilang saat server di-restart
- Untuk pengembangan lebih lanjut, dapat diganti dengan database persisten

## API Endpoints

### Autentikasi
- POST /api/auth/register - Registrasi pengguna baru
- POST /api/auth/login - Login pengguna
- GET /api/auth/profile - Mendapatkan profil pengguna saat ini

### Pengguna
- GET /api/users - Mendapatkan semua pengguna (admin only)
- GET /api/users/:id - Mendapatkan pengguna berdasarkan ID
- PUT /api/users/:id - Memperbarui data pengguna
- DELETE /api/users/:id - Menghapus pengguna (admin only)
- PUT /api/users/:id/change-password - Mengubah password pengguna

### Hotel
- POST /api/hotels - Menambahkan hotel baru (admin only)
- GET /api/hotels - Mendapatkan semua hotel (berdasarkan role)
- GET /api/hotels/:id - Mendapatkan hotel berdasarkan ID
- PUT /api/hotels/:id - Memperbarui data hotel
- DELETE /api/hotels/:id - Menghapus hotel (admin only)

### Kamar
- POST /api/rooms - Menambahkan kamar baru
- GET /api/rooms/hotel/:hotelId - Mendapatkan semua kamar berdasarkan hotel ID
- GET /api/rooms/:id - Mendapatkan kamar berdasarkan ID
- PUT /api/rooms/:id - Memperbarui data kamar
- DELETE /api/rooms/:id - Menghapus kamar

### Ketersediaan Kamar
- POST /api/availability - Menambah/memperbarui ketersediaan kamar
- GET /api/availability/room/:room_id - Mendapatkan ketersediaan kamar berdasarkan ID kamar dan rentang tanggal
- POST /api/availability/bulk-upload - Upload ketersediaan kamar secara massal via CSV

### Reservasi
- POST /api/reservations - Membuat reservasi baru
- GET /api/reservations/hotel/:hotelId - Mendapatkan semua reservasi berdasarkan hotel ID
- GET /api/reservations/:id - Mendapatkan reservasi berdasarkan ID
- PUT /api/reservations/:id/status - Memperbarui status reservasi

### Promosi
- POST /api/promotions - Membuat promosi baru
- GET /api/promotions/hotel/:hotelId - Mendapatkan semua promosi berdasarkan hotel ID
- GET /api/promotions/:id - Mendapatkan promosi berdasarkan ID
- PUT /api/promotions/:id - Memperbarui data promosi
- DELETE /api/promotions/:id - Menghapus promosi

### Transaksi
- POST /api/transactions - Membuat transaksi baru
- GET /api/transactions/hotel/:hotelId - Mendapatkan semua transaksi berdasarkan hotel ID
- GET /api/transactions/:id - Mendapatkan transaksi berdasarkan ID
- PUT /api/transactions/:id/status - Memperbarui status transaksi
- GET /api/transactions/invoice/hotel/:hotelId - Membuat laporan invoice bulanan

### Rekening Bank
- POST /api/bank-accounts - Menambahkan rekening bank baru
- GET /api/bank-accounts/hotel/:hotelId - Mendapatkan semua rekening bank berdasarkan hotel ID
- GET /api/bank-accounts/:id - Mendapatkan rekening bank berdasarkan ID
- PUT /api/bank-accounts/:id - Memperbarui data rekening bank
- DELETE /api/bank-accounts/:id - Menghapus rekening bank

### Upload
- POST /api/uploads/image - Upload gambar tunggal
- POST /api/uploads/images - Upload beberapa gambar
- GET /api/uploads/:filename - Mengakses file yang diupload
