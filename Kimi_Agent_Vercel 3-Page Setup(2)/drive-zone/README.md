# Drive Zone - Sistem Booking Rental Mobil

Sistem booking rental mobil dengan 3 halaman terintegrasi:
- **/** - Halaman Booking (Form pemesanan)
- **/admin** - Halaman Admin (Dashboard kelola pesanan)
- **/tracking** - Halaman Tracking (Cek status pesanan)

## Cara Deploy ke Vercel

### Opsi 1: Deploy via GitHub (Direkomendasikan)

1. **Buat repository baru di GitHub**
   - Kunjungi https://github.com/new
   - Beri nama: `drive-zone`
   - Pilih "Public" atau "Private"
   - Klik "Create repository"

2. **Upload file ke GitHub**
   ```bash
   # Di folder project ini, jalankan:
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/drive-zone.git
   git push -u origin main
   ```
   
   Atau upload manual via web GitHub:
   - Klik "uploading an existing file"
   - Upload semua file: `index.html`, `admin.html`, `tracking.html`, `vercel.json`

3. **Hubungkan ke Vercel**
   - Kunjungi https://vercel.com/new
   - Login dengan akun GitHub
   - Pilih repository `drive-zone`
   - Klik "Deploy"

### Opsi 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel
```

## URL yang Akan Didapat

Setelah deploy berhasil, Anda akan mendapatkan 3 URL:
- `https://nama-project.vercel.app/` → Halaman Booking
- `https://nama-project.vercel.app/admin` → Halaman Admin
- `https://nama-project.vercel.app/tracking?id=ID_PESANAN` → Halaman Tracking

## Fitur

### Halaman Booking (/)
- Form pemesanan rental mobil
- Pilih kendaraan (Avanza, Innova, Ertiga, Hiace, Fortuner, Alphard)
- Pilih tanggal sewa & lokasi pengambilan
- Opsi dengan/tanpa pengemudi
- Estimasi biaya otomatis
- Kirim pesanan ke WhatsApp
- Generate ID pesanan unik

### Halaman Admin (/admin)
- Login dengan password: `admin123` (bisa diganti di kode)
- Dashboard statistik pesanan
- Kelola status pesanan (Pending → Confirmed → Active → Completed)
- Input data pengemudi & nomor polisi
- Upload invoice & foto kendaraan
- Tandai pembayaran lunas

### Halaman Tracking (/tracking)
- Cek status pesanan dengan ID
- Visualisasi progress step-by-step
- Lihat detail pesanan
- Download invoice
- Lihat foto kendaraan

## Catatan Penting

- Data disimpan di **localStorage** browser (tidak permanen)
- Untuk produksi, disarankan menambahkan backend/database
- Password admin bisa diganti di file `admin.html` baris 243
- Nomor WhatsApp bisa diganti di file `index.html` baris 237

## Struktur File

```
drive-zone/
├── index.html      # Halaman Booking (Home)
├── admin.html      # Halaman Admin Dashboard
├── tracking.html   # Halaman Tracking Status
├── vercel.json     # Konfigurasi routing Vercel
└── README.md       # Dokumentasi ini
```
