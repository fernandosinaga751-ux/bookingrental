# 🚀 SETUP FIREBASE - DRIVE ZONE (LENGKAP)

## 📋 Informasi Akun

| Field | Value |
|-------|-------|
| **Email Admin** | fernandosinaga751@gmail.com |
| **Password Admin** | IvanaIsabel2225 |
| **Project Name** | drive-zone-rental |

---

## 🎯 Langkah 1: Install Prerequisites

### 1.1 Install Node.js
1. Buka https://nodejs.org
2. Download versi **LTS** (18.x atau 20.x)
3. Install dengan default settings

### 1.2 Verifikasi Installasi
Buka terminal/command prompt dan jalankan:
```bash
node --version
npm --version
```

Harus muncul versi (contoh: v18.17.0)

---

## 🔥 Langkah 2: Setup Firebase CLI

### 2.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2.2 Login ke Firebase
```bash
firebase login
```
- Browser akan terbuka otomatis
- Login dengan akun Google Anda
- Izinkan akses Firebase

### 2.3 Verifikasi Login
```bash
firebase projects:list
```

---

## 🏗️ Langkah 3: Buat Project Firebase

### 3.1 Buka Firebase Console
1. Buka https://console.firebase.google.com
2. Login dengan akun Google Anda

### 3.2 Create New Project
1. Klik **"Create a project"**
2. **Project name**: `drive-zone-rental`
3. (Opsional) Enable Google Analytics
4. Klik **"Create project"**
5. Tunggu sampai project selesai dibuat

### 3.3 Catat Project ID
- Project ID akan terlihat di URL atau dashboard
- Contoh: `drive-zone-rental` atau `drive-zone-rental-12345`

---

## 🗄️ Langkah 4: Setup Firestore Database

### 4.1 Aktifkan Firestore
1. Di sidebar kiri, klik **"Build"** → **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"**
4. Klik **"Next"**
5. **Cloud Firestore location**: Pilih `asia-southeast1` (Singapore)
6. Klik **"Enable"**

### 4.2 Update Security Rules
1. Di Firestore Database, klik tab **"Rules"**
2. Hapus semua text yang ada
3. Copy-paste isi file `firestore.rules` yang sudah saya siapkan
4. Klik **"Publish"**

---

## 🔐 Langkah 5: Setup Authentication

### 5.1 Aktifkan Email/Password Auth
1. Di sidebar, klik **"Build"** → **"Authentication"**
2. Klik **"Get started"**
3. Pilih tab **"Sign-in method"**
4. Klik **"Email/Password"**
5. Toggle **"Enable"** → **ON**
6. Klik **"Save"**

---

## ⚙️ Langkah 6: Inisialisasi Project Lokal

### 6.1 Buat Folder Project
```bash
# Windows (Command Prompt atau PowerShell)
mkdir C:\drive-zone-firebase
cd C:\drive-zone-firebase

# Mac/Linux
mkdir ~/drive-zone-firebase
cd ~/drive-zone-firebase
```

### 6.2 Copy Semua File
Copy semua file dari folder `drive-zone` ke folder `drive-zone-firebase`:
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- Folder `functions/`
- Semua file HTML
- Semua gambar mobil

### 6.3 Inisialisasi Firebase
```bash
firebase init
```

Pilih opsi berikut:
- **Firestore**: ✅ (pilih dengan spasi, enter untuk lanjut)
- **Functions**: ✅
- **Hosting**: ✅

Konfigurasi:
- **Project**: Pilih `drive-zone-rental` (yang sudah dibuat)
- **Firestore rules file**: `firestore.rules` (tekan Enter)
- **Firestore indexes file**: `firestore.indexes.json` (tekan Enter)
- **Functions folder**: `functions` (tekan Enter)
- **Language**: JavaScript
- **ESLint**: No
- **Install dependencies**: Yes
- **Public directory**: `.` (titik)
- **Configure as single-page app**: No
- **Set up automatic builds**: No

---

## 🚀 Langkah 7: Deploy Cloud Functions

### 7.1 Install Dependencies
```bash
cd functions
npm install
```

### 7.2 Deploy Functions
```bash
cd ..
firebase deploy --only functions
```

Tunggu sampai deploy selesai. Anda akan melihat output seperti:
```
✔  functions[setAdminClaim]: Successful create operation
✔  functions[seedCars]: Successful create operation
✔  functions[createAdminUser]: Successful create operation
✔  functions[backupBookings]: Successful create operation
✔  functions[onNewBooking]: Successful create operation
✔  functions[onBookingUpdate]: Successful create operation
✔  functions[getStats]: Successful create operation
✔  functions[health]: Successful create operation
```

---

## 👤 Langkah 8: Buat Admin User

### 8.1 Panggil Cloud Function
Setelah functions berhasil deploy, panggil endpoint untuk membuat admin user:

```bash
# Ganti PROJECT_ID dengan ID project Anda
curl -X POST https://us-central1-PROJECT_ID.cloudfunctions.net/createAdminUser \
  -H "Content-Type: application/json" \
  -H "x-secret-key: drivezone2025"
```

**Atau** buka di browser:
```
https://us-central1-PROJECT_ID.cloudfunctions.net/createAdminUser
```

Tambahkan header:
- Key: `x-secret-key`
- Value: `drivezone2025`

### 8.2 Verifikasi User
1. Buka Firebase Console → Authentication → Users
2. Anda akan melihat user dengan email: `fernandosinaga751@gmail.com`
3. Status: **Enabled**

---

## 🚗 Langkah 9: Seed Data Mobil

### 9.1 Panggil Endpoint Seed Cars
```bash
# Ganti PROJECT_ID dengan ID project Anda
curl -X POST https://us-central1-PROJECT_ID.cloudfunctions.net/seedCars \
  -H "Content-Type: application/json" \
  -H "x-secret-key: drivezone2025"
```

### 9.2 Verifikasi Data
1. Buka Firebase Console → Firestore Database
2. Anda akan melihat collection `cars` dengan 9 dokumen

---

## 🌐 Langkah 10: Ambil API Configuration

### 10.1 Dapatkan Config
1. Di Firebase Console, klik ikon gear (⚙️) → **"Project settings"**
2. Scroll ke **"Your apps"**
3. Klik ikon **"</>"** (Web)
4. **App nickname**: `drive-zone-web`
5. Klik **"Register app"**
6. Copy config yang muncul

### 10.2 Update File HTML
Buka ketiga file HTML dan ganti bagian `firebaseConfig`:

**File: `index-firebase.html`, `admin-firebase.html`, `tracking-firebase.html`**

Cari:
```javascript
const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_ANDA",
  authDomain: "drive-zone-rental.firebaseapp.com",
  projectId: "drive-zone-rental",
  storageBucket: "drive-zone-rental.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};
```

Ganti dengan config dari Firebase Console:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567",
  authDomain: "drive-zone-rental.firebaseapp.com",
  projectId: "drive-zone-rental",
  storageBucket: "drive-zone-rental.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## 🚀 Langkah 11: Deploy ke Firebase Hosting

### 11.1 Deploy
```bash
firebase deploy
```

### 11.2 Dapatkan URL
Setelah deploy selesai, Anda akan melihat:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/drive-zone-rental/overview
Hosting URL: https://drive-zone-rental.web.app
```

**URL Website Anda**: `https://drive-zone-rental.web.app`

---

## ✅ Langkah 12: Testing

### 12.1 Test Form Booking
1. Buka `https://drive-zone-rental.web.app`
2. Isi form booking
3. Submit
4. Cek di Firebase Console → Firestore → bookings
5. Data harus muncul!

### 12.2 Test Admin Login
1. Buka `https://drive-zone-rental.web.app/admin-firebase.html`
2. Login dengan:
   - Email: `fernandosinaga751@gmail.com`
   - Password: `IvanaIsabel2225`
3. Harus bisa lihat daftar pesanan!

### 12.3 Test Tracking
1. Copy ID pesanan dari admin
2. Buka `https://drive-zone-rental.web.app/tracking-firebase.html?id=ID_PESANAN`
3. Data harus muncul!

---

## 🔧 Troubleshooting

### Error: "Permission denied"
**Solusi**:
- Cek Firestore Rules sudah di-publish
- Cek user sudah login
- Cek admin claim sudah di-set

### Error: "API key invalid"
**Solusi**:
- Pastikan API key sudah diganti dengan yang benar
- Cek project ID sudah benar

### Error: "Function deployment failed"
**Solusi**:
```bash
# Upgrade Firebase CLI
npm install -g firebase-tools@latest

# Coba deploy lagi
firebase deploy --only functions
```

### Data tidak muncul di Firestore
**Solusi**:
- Cek collection name: `bookings`, `cars`, `rekening`
- Cek field names sesuai dengan kode

---

## 📊 Struktur Database

```
drive-zone-rental (Project)
│
├── bookings (Collection)
│   ├── DZ202502-ABC123 (Document)
│   │   ├── id: "DZ202502-ABC123"
│   │   ├── nama: "Budi Santoso"
│   │   ├── wa: "08123456789"
│   │   ├── car: "avanza"
│   │   ├── carLabel: "New Avanza 2024"
│   │   ├── startDate: "2025-03-01"
│   │   ├── endDate: "2025-03-03"
│   │   ├── days: 3
│   │   ├── totalPrice: 1050000
│   │   ├── status: "pending"
│   │   ├── paymentStatus: "unpaid"
│   │   ├── createdAt: Timestamp
│   │   └── ...
│   └── ...
│
├── cars (Collection)
│   ├── avanza { label, price, img }
│   ├── innova_reborn { label, price, img }
│   └── ... (9 mobil)
│
├── rekening (Collection)
│   └── ... (data rekening bank)
│
├── admins (Collection)
│   └── UID { email, isAdmin, createdAt }
│
├── auditLogs (Collection)
│   └── ... (log aktivitas)
│
└── backups (Collection)
    └── YYYY-MM-DD { data, count, createdAt }
```

---

## 💰 Estimasi Biaya Firebase

| Pakai | Biaya |
|-------|-------|
| **< 100 booking/bulan** | **GRATIS** |
| 500 booking/bulan | ~$2-5 |
| 1000+ booking/bulan | ~$10-20 |

**Untuk rental mobil skala kecil-menengah: GRATIS!** 🎉

---

## 🔒 Security Features

| Fitur | Status |
|-------|--------|
| Database terenkripsi (AES-256) | ✅ |
| Authentication dengan email/password | ✅ |
| Security Rules (kontrol akses) | ✅ |
| Backup otomatis harian | ✅ |
| Audit log aktivitas | ✅ |
| SSL/HTTPS gratis | ✅ |
| DDoS Protection | ✅ |

---

## 📞 Butuh Bantuan?

Jika mengalami kesulitan:
1. Cek Firebase Console untuk error logs
2. Buka browser DevTools (F12) → Console untuk melihat error
3. Hubungi saya dengan screenshot error

---

## 🎉 Selamat!

Website Drive Zone Anda sekarang sudah:
- ✅ Aman dengan Firebase
- ✅ Database terenkripsi
- ✅ Backup otomatis
- ✅ Authentication aman
- ✅ Hosting gratis dengan HTTPS

**URL Website**: `https://drive-zone-rental.web.app`

**Admin Login**:
- URL: `https://drive-zone-rental.web.app/admin-firebase.html`
- Email: `fernandosinaga751@gmail.com`
- Password: `IvanaIsabel2225`
