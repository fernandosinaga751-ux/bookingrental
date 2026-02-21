# 🚀 Setup Firebase untuk Drive Zone (Keamanan Maksimal)

## 📋 Ringkasan

Panduan ini akan membantu Anda setup Firebase untuk website Drive Zone dengan keamanan enterprise-grade.

**Keuntungan Firebase:**
- ✅ Database terenkripsi (AES-256)
- ✅ Authentication aman dengan email/password
- ✅ Backup otomatis
- ✅ Security Rules (kontrol akses granular)
- ✅ SSL/HTTPS gratis
- ✅ DDoS Protection
- ✅ **GRATIS** untuk pemakaian ringan

---

## 🎯 Langkah 1: Buat Project Firebase

### 1.1 Daftar/Login Firebase
1. Buka https://firebase.google.com
2. Klik **"Get Started"** atau **"Go to Console"**
3. Login dengan akun Google Anda

### 1.2 Buat Project Baru
1. Klik **"Create a project"**
2. **Project name**: `drive-zone-rental`
3. (Opsional) Enable Google Analytics → pilih akun Google
4. Klik **"Create project"**
5. Tunggu sampai project selesai dibuat

---

## 🗄️ Langkah 2: Setup Firestore Database

### 2.1 Aktifkan Firestore
1. Di sidebar kiri, klik **"Build"** → **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in production mode"** (untuk keamanan)
4. Klik **"Next"**
5. **Cloud Firestore location**: Pilih `asia-southeast1` (Singapore)
6. Klik **"Enable"**

### 2.2 Setup Security Rules
1. Di Firestore Database, klik tab **"Rules"**
2. Hapus semua text yang ada
3. Copy-paste rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fungsi cek admin
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }
    
    // Collection: bookings
    match /bookings/{bookingId} {
      // Semua orang bisa create (untuk form booking)
      allow create: if true;
      
      // Hanya admin yang bisa read dan update
      allow read, update: if isAdmin();
    }
    
    // Collection: cars
    match /cars/{carId} {
      // Semua orang bisa read
      allow read: if true;
      
      // Hanya admin yang bisa write
      allow write: if isAdmin();
    }
    
    // Collection: rekening
    match /rekening/{rekId} {
      // Hanya admin yang bisa read dan write
      allow read, write: if isAdmin();
    }
  }
}
```

4. Klik **"Publish"**

---

## 🔐 Langkah 3: Setup Authentication

### 3.1 Aktifkan Email/Password Auth
1. Di sidebar, klik **"Build"** → **"Authentication"**
2. Klik **"Get started"**
3. Pilih tab **"Sign-in method"**
4. Klik **"Email/Password"**
5. Toggle **"Enable"** → **ON**
6. Klik **"Save"**

### 3.2 Tambah Admin User
1. Klik tab **"Users"**
2. Klik **"Add user"**
3. **Email**: `admin@drivezone.com` (atau email Anda)
4. **Password**: Buat password kuat (min 8 karakter, huruf + angka + simbol)
5. Klik **"Add user"**
6. **Catat UID user** (string panjang, contoh: `AbC123XyZ...`)

---

## 🔑 Langkah 4: Set Admin Claims (WAJIB!)

Untuk memberikan hak admin, Anda perlu set custom claims.

### 4.1 Install Firebase CLI
Buka terminal/command prompt:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login
```

### 4.2 Buat Cloud Function untuk Set Admin

Buat folder baru dan inisialisasi:

```bash
mkdir drive-zone-functions
cd drive-zone-functions
firebase init functions
```

Pilih:
- **Language**: JavaScript
- **ESLint**: No
- **Install dependencies**: Yes

Edit file `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Cek apakah caller adalah admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Hanya admin yang bisa akses');
  }
  
  const { uid } = data;
  
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { success: true, message: 'Admin claim berhasil di-set' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

Deploy function:

```bash
firebase deploy --only functions
```

### 4.3 Set Admin Claim untuk User

Setelah deploy, jalankan di terminal:

```bash
# GANTI UID_ANDA dengan UID dari langkah 3.2
# GANTI PROJECT_ID dengan ID project Firebase Anda

curl -X POST \
  https://us-central1-PROJECT_ID.cloudfunctions.net/setAdminClaim \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "uid": "UID_ANDA"
    }
  }'
```

**Alternatif**: Gunakan Firebase Console → Authentication → User → Edit → Custom claims:
```json
{"admin": true}
```

---

## 🌐 Langkah 5: Ambil API Configuration

### 5.1 Dapatkan Config
1. Klik ikon gear (⚙️) → **"Project settings"**
2. Scroll ke **"Your apps"**
3. Klik ikon **"</>"** (Web)
4. **App nickname**: `drive-zone-web`
5. Klik **"Register app"**
6. Copy config yang muncul:

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

### 5.2 Update File HTML

Ganti config di ketiga file:
- `index-firebase.html`
- `admin-firebase.html`
- `tracking-firebase.html`

Cari bagian:
```javascript
const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_ANDA",
  ...
};
```

Ganti dengan config Anda.

---

## 🗃️ Langkah 6: Seed Data Mobil

### 6.1 Tambah Data Mobil ke Firestore

Buka Firebase Console → Firestore Database → **"Start collection"**

**Collection ID**: `cars`

Tambah dokumen dengan ID berikut:

| Document ID | Field | Value |
|-------------|-------|-------|
| `avanza` | label | "New Avanza 2024" |
| | price | 350000 |
| | img | "1000537007.png" |
| `innova_reborn` | label | "Innova Reborn" |
| | price | 500000 |
| | img | "1000537006.jpg" |
| `innova_zenix` | label | "Innova Zenix" |
| | price | 550000 |
| | img | "1000537006.jpg" |
| `fortuner` | label | "Fortuner 2024" |
| | price | 750000 |
| | img | "1000537008.jpg" |
| `pajero` | label | "Pajero 2024" |
| | price | 800000 |
| | img | "1000537014.jpg" |
| `alphard_2023` | label | "Alphard 2023" |
| | price | 1500000 |
| | img | "1000537012.jpg" |
| `alphard_2025` | label | "New Alphard 2025" |
| | price | 1800000 |
| | img | "1000537013.jpg" |
| `hiace_commuter` | label | "Hiace Commuter" |
| | price | 900000 |
| | img | "1000537011.jpg" |
| `hiace_premio` | label | "Hiace Premio" |
| | price | 1100000 |
| | img | "1000537010.jpg" |

---

## 🚀 Langkah 7: Deploy ke Firebase Hosting (Opsional)

Jika ingin hosting di Firebase (bukan Vercel):

```bash
# Inisialisasi hosting
firebase init hosting

# Pilih project Anda
# Public directory: . (titik)
# Configure as single-page app: No

# Deploy
firebase deploy
```

---

## ✅ Verifikasi Setup

### Cek 1: Test Form Booking
1. Buka `index-firebase.html`
2. Isi form dan submit
3. Cek di Firebase Console → Firestore → bookings
4. Data harus muncul!

### Cek 2: Test Admin Login
1. Buka `admin-firebase.html`
2. Login dengan email admin
3. Harus bisa lihat daftar pesanan

### Cek 3: Test Tracking
1. Copy ID pesanan dari admin
2. Buka `tracking-firebase.html?id=ID_PESANAN`
3. Data harus muncul!

---

## 🔒 Security Checklist

- [ ] Firestore Rules sudah di-set
- [ ] Authentication sudah enable
- [ ] Admin user sudah dibuat
- [ ] Admin claim sudah di-set
- [ ] API key sudah diganti
- [ ] Data mobil sudah di-seed

---

## 💰 Estimasi Biaya

| Fitur | Gratis (Spark) | Bayar (Blaze) |
|-------|----------------|---------------|
| Database reads | 50K/hari | $0.06/100K |
| Database writes | 20K/hari | $0.18/100K |
| Auth users | 10K/bulan | $0.01/verify |
| **Untuk** | < 100 booking/bulan | > 1000 booking/bulan |

**Untuk rental mobil skala kecil-menengah: GRATIS!** 🎉

---

## 🆘 Troubleshooting

### Error: "Permission denied"
- Cek Firestore Rules sudah di-publish
- Cek user sudah login
- Cek admin claim sudah di-set

### Error: "API key invalid"
- Pastikan API key sudah diganti dengan yang benar
- Cek project ID sudah benar

### Data tidak muncul
- Cek collection name: `bookings`, `cars`, `rekening`
- Cek field names sesuai dengan kode

---

## 📞 Butuh Bantuan?

Jika mengalami kesulitan, saya bisa bantu setup sepenuhnya. Berikan saja:
1. Akun Google (email)
2. Password yang diinginkan untuk admin

Saya akan setupkan semuanya! 🚀
