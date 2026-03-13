# 🚗 Dearma Jaya Transport — Panduan Setup Lengkap

## ARSITEKTUR SISTEM

```
Browser → Vercel (hosting + API proxy)
               ↕ Firebase Firestore  (database semua pesanan)
               ↕ Cloudflare R2       (storage file: invoice PDF + foto)
```

---

## LANGKAH 1: Buat Firebase Project

### 1.1 Buat Project
1. Buka https://console.firebase.google.com → **Create a project**
2. Nama: `dearma-rental` → Continue → Create

### 1.2 Firestore Database
1. Sidebar: **Build → Firestore Database → Create database**
2. Pilih: **Start in test mode**
3. Location: **asia-southeast1** (Singapore)
4. Klik **Enable**

### 1.3 Authentication (wajib untuk auth write)
1. Sidebar: **Build → Authentication → Get started**
2. Tab **Sign-in method** → Enable **Anonymous** → Save

### 1.4 Ambil Firebase Config
1. ⚙️ → **Project settings** → scroll ke **Your apps** → klik **</>** (Web)
2. App nickname: `dearma-web` → Register app
3. Copy nilai `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`

### 1.5 Deploy Firestore Rules
1. Buka **Firestore Database → Rules**
2. Copy-paste isi file `firestore.rules` → **Publish**

---

## LANGKAH 2: Buat Cloudflare R2 Bucket

### 2.1 Buat Bucket
1. Login ke https://dash.cloudflare.com → **R2 Object Storage**
2. Klik **Create bucket**
3. Nama bucket: `dearma-files` (bebas)
4. Klik **Create bucket**

### 2.2 Aktifkan Public Access
1. Di halaman bucket → tab **Settings**
2. Scroll ke **Public access** → **Allow Access**
3. Klik **Custom Domain** atau catat **R2.dev subdomain**
   - Format: `https://pub-xxxxxxxxxxxxxxxx.r2.dev`
   - Ini adalah `R2_PUBLIC_URL` yang akan dipakai

### 2.3 Buat API Token untuk Upload
1. Di Cloudflare Dashboard → **R2 → Manage R2 API tokens**
2. Klik **Create API token**
3. Permissions: **Object Read & Write**
4. Specify bucket: pilih bucket `dearma-files`
5. Klik **Create API Token**
6. Salin & simpan:
   - **Access Key ID** → ini `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → ini `R2_SECRET_ACCESS_KEY`
   - **Account ID** → ada di kanan atas dashboard, ini `R2_ACCOUNT_ID`

---

## LANGKAH 3: Setup GitHub Repository

1. Buka https://github.com → **New repository**
2. Nama: `dearma-rental` → Create repository
3. Upload semua file dari folder ini ke root repo
4. Pastikan struktur folder seperti ini:
   ```
   /
   ├── api/
   │   ├── upload-url.js
   │   └── delete-file.js
   ├── public/
   │   ├── index.html
   │   ├── admin.html
   │   ├── tracking.html
   │   ├── config.js          ← WAJIB DIISI
   │   ├── dearmajaya-logo.png
   │   └── 1000537*.jpg/png   (gambar mobil)
   ├── package.json
   ├── vercel.json
   └── firestore.rules
   ```

---

## LANGKAH 4: Deploy ke Vercel

### 4.1 Connect ke Vercel
1. Buka https://vercel.com → Login dengan GitHub
2. **Add New Project** → pilih repo `dearma-rental`
3. Framework Preset: **Other**
4. Klik **Deploy**

### 4.2 WAJIB: Tambah Environment Variables di Vercel
Di Vercel Dashboard → Project → **Settings → Environment Variables**
Tambahkan variabel berikut (semua environment: Production, Preview, Development):

| Nama Variable        | Nilai                                         |
|----------------------|-----------------------------------------------|
| `R2_ACCOUNT_ID`      | Account ID Cloudflare Anda                    |
| `R2_ACCESS_KEY_ID`   | Access Key ID dari R2 API Token               |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key dari R2 API Token         |
| `R2_BUCKET_NAME`     | Nama bucket R2, contoh: `dearma-files`        |
| `R2_PUBLIC_URL`      | URL publik R2, contoh: `https://pub-xxx.r2.dev` |

Setelah menambahkan semua variabel → **Redeploy** project

---

## LANGKAH 5: Isi config.js

Buka file `public/config.js` dan ganti semua placeholder:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",
  authDomain:        "dearma-rental.firebaseapp.com",
  projectId:         "dearma-rental",
  storageBucket:     "dearma-rental.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};

const R2_PUBLIC_URL = "https://pub-xxxxxxxx.r2.dev";  // ← dari Cloudflare R2
const ADMIN_PASS    = "password_anda_yang_kuat";       // ← ganti!
const WA_NUMBER     = "6281234567890";                 // ← nomor WA bisnis (tanpa +)
```

Commit dan push perubahan ini ke GitHub → Vercel akan auto-deploy.

---

## CARA KERJA UPLOAD FILE

```
Admin klik upload file
      ↓
Browser minta presigned URL ke /api/upload-url (Vercel serverless)
      ↓
Vercel API menggunakan R2 credentials (aman, tidak expose ke browser)
      ↓
Vercel kembalikan presigned URL (berlaku 5 menit)
      ↓
Browser upload file LANGSUNG ke Cloudflare R2 via presigned URL
      ↓
URL publik file disimpan ke Firestore
      ↓
Halaman tracking bisa download file dari URL R2
```

**Keunggulan arsitektur ini:**
- ✅ R2 secret key **tidak pernah** expose ke browser
- ✅ Upload langsung ke R2 (tidak lewat Vercel = tidak kena bandwidth limit)
- ✅ File tersimpan di CDN Cloudflare (download cepat)
- ✅ R2 = gratis 10GB storage + gratis egress bandwidth

---

## RINGKASAN FILE KONFIGURASI

| File | Fungsi | Yang Perlu Diisi |
|------|--------|------------------|
| `public/config.js` | Config frontend | Firebase config, R2 URL, WA number, admin password |
| Vercel Env Vars | Secret R2 credentials | R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL |
| `firestore.rules` | Security database | Copy-paste ke Firebase Console |

---

## FITUR LENGKAP

### Form Booking (/)
- Pilih kendaraan dari Firestore (real-time)
- 3 tipe layanan: Dengan Supir / Lepas Kunci / All In Dalam Kota
- Estimasi harga otomatis
- Kirim notifikasi ke WhatsApp admin
- Data tersimpan ke Firestore

### Admin Dashboard (/admin)
- Login dengan password
- List pesanan dari Firestore (real-time)
- Kelola status pesanan
- Update info driver & nomor polisi
- Upload invoice PDF → **Cloudflare R2**
- Upload foto kendaraan → **Cloudflare R2**
- Tandai pembayaran lunas
- Tambah mobil baru ke daftar
- Atur harga normal & harga All In
- Kelola rekening bank

### Halaman Tracking (/tracking?id=xxx)
- Cek status pesanan real-time dari Firestore
- Info driver & nomor polisi
- Download invoice dari R2
- Lihat foto kendaraan dari R2

---

## CATATAN PENTING

- Setelah menambahkan Env Variables di Vercel, **WAJIB Redeploy**
- Password admin default `admin123` — **HARUS DIGANTI** di `config.js`
- Firestore rules sudah dikonfigurasi agar pesanan bisa dibuat publik tapi hanya admin (auth) yang bisa update/delete
