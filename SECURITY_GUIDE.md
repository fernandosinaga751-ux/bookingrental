# 🔒 Panduan Keamanan Drive Zone

## 📊 Tingkat Keamanan Saat Ini

### ⚠️ Kelemahan Website Static (HTML + localStorage):

```
┌────────────────────────────────────────────┐
│  MASALAH KEAMANAN                          │
├────────────────────────────────────────────┤
│ ❌ Data tersimpan di browser user          │
│ ❌ Bisa dihapus oleh user                  │
│ ❌ Bisa dilihat oleh user (DevTools)       │
│ ❌ Tidak ada backup                        │
│ ❌ Tidak ada enkripsi                      │
│ ❌ Password admin mudah ditebak            │
│ ❌ Tidak ada audit log                     │
└────────────────────────────────────────────┘
```

### ✅ Keamanan yang Sudah Ada:
- ✅ HTTPS/SSL (dari Vercel)
- ✅ Tidak ada data sensitif di kode

---

## 🛡️ Solusi Keamanan yang Direkomendasikan

### **Tier 1: BASIC (Gratis) - Untuk Pemula**
Gunakan Firebase Firestore + Firebase Auth

| Fitur | Status |
|-------|--------|
| Database terenkripsi | ✅ |
| Authentication aman | ✅ |
| Backup otomatis | ✅ |
| Security Rules | ✅ |
| SSL/HTTPS | ✅ |
| **Biaya** | **GRATIS** (untuk pemakaian ringan) |

### **Tier 2: STANDARD ($20-50/bulan)**
- Firebase Blaze Plan
- Vercel Pro
- Custom Domain + SSL

### **Tier 3: ENTERPRISE ($100+/bulan)**
- AWS/GCP dengan VPC
- Database private
- DDoS Protection
- Security Audit

---

## 🚀 Setup Firebase (GRATIS) - Langkah demi Langkah

### **Step 1: Buat Akun Firebase**

1. Buka https://firebase.google.com
2. Klik "Get Started" atau "Go to Console"
3. Login dengan akun Google Anda
4. Klik "Create Project"
5. Isi nama project: `drive-zone-rental`
6. (Optional) Enable Google Analytics
7. Klik "Create Project"
8. Tunggu sampai project selesai dibuat

---

### **Step 2: Setup Firestore Database**

1. Di sidebar kiri, klik **"Build"** → **"Firestore Database"**
2. Klik **"Create Database"**
3. Pilih **"Start in production mode"** (lebih aman)
4. Atau pilih **"Start in test mode"** (untuk testing)
5. Pilih lokasi: **"asia-southeast1"** (Singapore)
6. Klik **"Enable"**

---

### **Step 3: Setup Authentication**

1. Di sidebar, klik **"Build"** → **"Authentication"**
2. Klik **"Get Started"**
3. Pilih tab **"Sign-in method"**
4. Enable **"Email/Password"**
5. (Optional) Enable **"Google"** untuk login dengan Google
6. Klik **"Save"**

---

### **Step 4: Setup Security Rules**

1. Di Firestore Database, klik tab **"Rules"**
2. Ganti dengan rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Data booking hanya bisa dibaca oleh admin atau pemilik
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (request.auth.token.admin == true || 
         resource.data.userId == request.auth.uid);
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Data mobil bisa dibaca semua, tapi hanya admin yang bisa edit
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Data rekening hanya admin yang bisa lihat dan edit
    match /rekening/{rekId} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

3. Klik **"Publish"**

---

### **Step 5: Ambil API Key**

1. Klik ikon gear (⚙️) → **"Project Settings"**
2. Scroll ke bawah ke **"Your apps"**
3. Klik ikon **"</>"** (Web)
4. Beri nama app: `drive-zone-web`
5. **Centang** "Also set up Firebase Hosting"
6. Klik **"Register app"**
7. Copy config yang muncul:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "drive-zone-rental.firebaseapp.com",
  projectId: "drive-zone-rental",
  storageBucket: "drive-zone-rental.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

### **Step 6: Buat Admin User**

1. Di sidebar, klik **"Build"** → **"Authentication"**
2. Klik tab **"Users"**
3. Klik **"Add User"**
4. Masukkan email dan password admin
5. Klik **"Add User"**
6. Catat UID user tersebut

---

### **Step 7: Set Admin Custom Claims**

1. Buka https://console.cloud.google.com/
2. Pilih project Firebase Anda
3. Buka **"Cloud Shell"** (ikon terminal di atas)
4. Jalankan command:

```bash
# Install firebase-admin
npm install -g firebase-tools

# Login
firebase login

# Set admin claim
curl -X POST -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "uid": "UID_ADMIN_ANDA",
      "claims": {"admin": true}
    }
  }' \
  https://us-central1-drive-zone-rental.cloudfunctions.net/setAdminClaim
```

Atau gunakan Cloud Function (saya buatkan di bawah).

---

## 📁 Struktur Database Firestore

```
drive-zone-rental (Project)
│
├── bookings (Collection)
│   ├── DZ202502-ABC123 (Document)
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
│   │   ├── driverName: "Pak Ahmad"
│   │   ├── driverPhone: "08198765432"
│   │   ├── vehiclePlate: "BK 1234 ABC"
│   │   ├── createdAt: Timestamp
│   │   └── ...
│   └── ...
│
├── cars (Collection)
│   ├── avanza
│   │   ├── label: "New Avanza 2024"
│   │   ├── price: 350000
│   │   └── img: "1000537007.png"
│   └── ...
│
└── rekening (Collection)
    ├── rek1
    │   ├── bank: "BCA"
    │   ├── nomor: "1234567890"
    │   └── nama: "PT Drive Zone"
    └── ...
```

---

## 🔐 Best Practice Keamanan

### 1. **Password yang Kuat**
```
❌ Jangan: admin123, password, 123456
✅ Gunakan: Dr1v3Z0n3!@#2025 (12+ karakter, campuran)
```

### 2. **Enable 2FA (Two Factor Authentication)**
- Di Firebase Auth, enable 2FA untuk admin
- Gunakan Google Authenticator

### 3. **Backup Database**
- Firebase otomatis backup
- Atau export manual tiap minggu

### 4. **Monitor Aktivitas**
- Cek Firebase Console → Authentication → Users
- Lihat siapa yang login

### 5. **Update Security Rules**
```javascript
// Contoh: Batasi akses berdasarkan waktu
allow write: if request.auth != null 
  && request.auth.token.admin == true
  && request.time < timestamp.date(2025, 12, 31);
```

---

## 💰 Estimasi Biaya Firebase

| Fitur | Gratis (Spark) | Bayar (Blaze) |
|-------|----------------|---------------|
| Database reads | 50K/hari | $0.06 per 100K |
| Database writes | 20K/hari | $0.18 per 100K |
| Storage | 1 GB | $0.026/GB |
| Bandwidth | 10 GB/bulan | $0.15/GB |
| **Cocok untuk** | < 100 booking/bulan | > 1000 booking/bulan |

---

## 🌐 Domain Custom (Opsional)

### Beli Domain di:
- **Namecheap**: ~$10/tahun
- **Google Domains**: ~$12/tahun
- **Niagahoster**: ~Rp 100rb/tahun

### Connect ke Firebase Hosting:
1. Firebase Console → Hosting
2. Klik "Add custom domain"
3. Ikuti instruksi DNS

---

## 📞 Butuh Bantuan Setup?

Jika Anda ingin saya bantu setup Firebase sepenuhnya, berikan:
1. Akun Google (email)
2. Nama domain yang diinginkan (opsional)

Saya akan buatkan:
- ✅ Project Firebase
- ✅ Database structure
- ✅ Security Rules
- ✅ Cloud Functions
- ✅ Website versi Firebase (lebih aman)

---

## ⚡ Ringkasan

| Pilihan | Keamanan | Biaya | Kesulitan |
|---------|----------|-------|-----------|
| **Static (sekarang)** | ⭐⭐ | Gratis | Mudah |
| **Firebase** | ⭐⭐⭐⭐⭐ | Gratis | Sedang |
| **VPS (AWS/DigitalOcean)** | ⭐⭐⭐⭐⭐ | $20-50/bulan | Sulit |

**Rekomendasi**: Mulai dengan **Firebase (GRATIS)** untuk keamanan yang jauh lebih baik! 🚀
