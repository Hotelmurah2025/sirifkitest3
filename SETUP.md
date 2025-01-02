# Panduan Instalasi dan Penggunaan Hotel PMS

## Persyaratan Sistem
- PHP >= 7.3
- MySQL >= 5.7
- Apache/Nginx web server
- Composer (untuk manajemen dependensi)
- Git (untuk clone repository)

## Langkah-langkah Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/Hotelmurah2025/sirifkitest3.git
cd sirifkitest3
```

### 2. Setup Database
1. Buat database MySQL baru:
```sql
CREATE DATABASE hotel_pms;
```

2. Import struktur database:
```bash
mysql -u [username] -p hotel_pms < database/hotel_pms.sql
```

3. Konfigurasi database di `application/config/database.php`:
```php
$db['default'] = array(
    'hostname' => 'localhost',
    'username' => 'your_username',
    'password' => 'your_password',
    'database' => 'hotel_pms',
    'dbdriver' => 'mysqli',
    ...
);
```

### 3. Konfigurasi Application
1. Copy `application/config/config.php.example` ke `application/config/config.php`
2. Sesuaikan base URL di `application/config/config.php`:
```php
$config['base_url'] = 'http://localhost/sirifkitest3/';
```

### 4. Setup Web Server

#### Untuk Apache:
1. Pastikan mod_rewrite aktif:
```bash
sudo a2enmod rewrite
sudo service apache2 restart
```

2. File `.htaccess` sudah tersedia di root project

#### Untuk Nginx:
Tambahkan konfigurasi berikut di site configuration:
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### 5. Pengaturan Permissions
```bash
chmod -R 755 .
chmod -R 777 application/cache
chmod -R 777 application/logs
```

## Menjalankan Aplikasi

1. Akses aplikasi melalui browser:
```
http://localhost/sirifkitest3
```

2. Login dengan akun default:
- Username: admin
- Password: admin123

## Struktur Menu

### 1. Dashboard
- Statistik hotel
- Notifikasi check-out
- Ringkasan pendapatan

### 2. Manajemen Kamar
- Daftar kamar
- Tambah/edit kamar
- Update status kamar

### 3. Reservasi
- Buat reservasi baru
- Daftar reservasi
- Kalender ketersediaan
- Proses check-in/out

### 4. Housekeeping
- Jadwal pembersihan
- Update status kamar
- Assign tugas

### 5. Laporan
- Laporan harian
- Laporan bulanan
- Statistik okupansi

## Troubleshooting

### 1. Issues Database
- Pastikan service MySQL berjalan
- Verifikasi kredensial database
- Cek permissions database user

### 2. Issues Permission
- Pastikan folder cache dan logs writeable
- Sesuaikan permissions file uploads

### 3. Issues .htaccess
- Verifikasi mod_rewrite aktif
- Cek syntax .htaccess
- Pastikan AllowOverride All di Apache config

## Keamanan

1. Ganti password default admin segera setelah login pertama
2. Update regular security patches
3. Backup database secara berkala
4. Monitor log akses dan error

## Maintenance

1. Backup rutin:
```bash
# Backup database
mysqldump -u [username] -p hotel_pms > backup_[date].sql

# Backup files
tar -czf backup_files_[date].tar.gz /path/to/sirifkitest3
```

2. Update sistem:
```bash
git pull origin main
```

3. Clear cache:
```bash
rm -rf application/cache/*
```

## Support
Untuk bantuan teknis, silakan hubungi tim support atau buat issue di repository GitHub.
