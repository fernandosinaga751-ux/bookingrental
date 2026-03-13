# 🚗 Dearma Jaya Transport — Panduan Setup Lengkap

## LANGKAH 1: Setup Firebase Project

### 1.1 Buat Firebase Project
1. Buka https://console.firebase.google.com
2. Klik **"Create a project"**
3. Nama project: `dearma-rental` (atau bebas)
4. Klik **Continue** → selesai

### 1.2 Setup Firestore Database
1. Di sidebar kiri: **Build → Firestore Database**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"**
4. Location: **asia-southeast1** (Singapore)
5. Klik **Enable**

### 1.3 Setup Firebase Storage
1. Di sidebar kiri: **Build → Storage**
2. Klik **"Get started"**
3. Pilih **"Start in test mode"**
4. Location: **asia-southeast1**
5. Klik **Done**

### 1.4 Setup Authentication (untuk admin upload)
1. Di sidebar kiri: **Build → Authentication**
2. Klik **"Get started"**
3. Tab **Sign-in method** → Enable **Anonymous**
4. Klik **Save**

### 1.5 Ambil Firebase Config
1. Klik ikon ⚙️ (gear) → **Project settings**
2. Scroll ke bawah → **"Your apps"** → Klik **"</>** (Web)"
3. App nickname: `dearma-web`
4. Klik **Register app**
5. Copy config yang muncul

### 1.6 Isi firebase-config.js
Buka file `firebase-config.js` dan ganti semua nilai:
```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",           // ← dari Firebase
  authDomain: "dearma-rental.firebaseapp.com",
  projectId: "dearma-rental",
  storageBucket: "dearma-rental.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
const WA_NUMBER = "6281234567890";  // ← nomor WhatsApp bisnis Anda
const ADMIN_PASS = "password_anda"; // ← ganti password admin
```

---

## LANGKAH 2: Deploy ke GitHub + Vercel

### 2.1 Upload ke GitHub
1. Buka https://github.com → Login
2. Klik **"New repository"**
3. Nama: `dearma-rental`
4. Klik **Create repository**
5. Upload semua file dari folder ini ke repo

### 2.2 Deploy ke Vercel
1. Buka https://vercel.com → Login dengan GitHub
2. Klik **"Add New → Project"**
3. Pilih repo `dearma-rental`
4. Framework Preset: **Other**
5. Klik **Deploy**
6. Selesai! URL live: `https://dearma-rental.vercel.app`

---

## LANGKAH 3: Deploy Firebase Rules

Install Firebase CLI (opsional, bisa skip jika pakai Vercel):
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules,storage
```

Atau copy-paste rules langsung di Firebase Console:
- **Firestore → Rules** → copy isi `firestore.rules`
- **Storage → Rules** → copy isi `storage.rules`

---

## FILE YANG PENTING

| File | Fungsi |
|------|--------|
| `firebase-config.js` | **⚠️ WAJIB DIISI** - config Firebase Anda |
| `index.html` | Halaman booking publik |
| `admin.html` | Dashboard admin |
| `tracking.html` | Halaman tracking pesanan |
| `vercel.json` | Routing Vercel |
| `firestore.rules` | Security rules database |
| `storage.rules` | Security rules file storage |

---

## FITUR YANG TERSEDIA

### Halaman Booking (index.html)
- ✅ Form booking dengan pilihan kendaraan
- ✅ Tipe layanan: Dengan Supir / Lepas Kunci / All In Dalam Kota
- ✅ Estimasi harga otomatis
- ✅ Kirim ke WhatsApp admin
- ✅ Data tersimpan ke Firestore

### Admin Dashboard (admin.html)
- ✅ Login dengan password
- ✅ Daftar semua pesanan real-time dari Firebase
- ✅ Kelola status pesanan
- ✅ Upload invoice PDF → tersimpan ke Firebase Storage
- ✅ Upload foto kendaraan → tersimpan ke Firebase Storage
- ✅ Update info driver & nomor polisi
- ✅ Tandai pembayaran lunas
- ✅ **Tambah mobil baru** ke daftar
- ✅ Atur harga mobil & harga All In
- ✅ Kelola rekening bank

### Halaman Tracking (tracking.html)
- ✅ Cek status pesanan real-time dari Firebase
- ✅ Info driver & nomor polisi
- ✅ Download invoice
- ✅ Lihat foto kendaraan

---

## CATATAN PENTING

- **Logo** sudah transparan (background putih sudah dihapus)
- **Fallback localStorage**: jika Firebase gagal, data tetap tersimpan lokal
- **Password admin default**: `admin123` → **WAJIB DIGANTI** di `firebase-config.js`
- **Nomor WhatsApp default**: `6281234567890` → **WAJIB DIGANTI** di `firebase-config.js`
