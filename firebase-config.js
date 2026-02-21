/**
 * FIREBASE CONFIGURATION - Drive Zone
 * 
 * INSTRUKSI SETUP:
 * 1. Buka https://firebase.google.com
 * 2. Login dengan akun Google
 * 3. Klik "Go to Console" → "Create Project"
 * 4. Beri nama: "drive-zone-rental"
 * 5. Disable Google Analytics (atau enable jika mau)
 * 6. Klik "Create Project"
 * 
 * SETUP FIRESTORE DATABASE:
 * 1. Di sidebar, klik "Build" → "Firestore Database"
 * 2. Klik "Create Database"
 * 3. Pilih "Start in test mode" (untuk development)
 * 4. Pilih lokasi: "asia-southeast1" (Singapore - terdekat)
 * 5. Klik "Enable"
 * 
 * SETUP AUTHENTICATION:
 * 1. Di sidebar, klik "Build" → "Authentication"
 * 2. Klik "Get Started"
 * 3. Pilih "Email/Password" → Enable → Save
 * 4. (Opsional) Tambah "Google" untuk login dengan Google
 * 
 * AMBIL CONFIG:
 * 1. Klik ikon gear (⚙️) → "Project Settings"
 * 2. Scroll ke bawah → "Your apps" → Klik "</>" (Web)
 * 3. Beri nama app: "drive-zone-web"
 * 4. Copy config di bawah ini, GANTI dengan config Anda:
 */

const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_ANDA",
  authDomain: "drive-zone-rental.firebaseapp.com",
  projectId: "drive-zone-rental",
  storageBucket: "drive-zone-rental.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};

// Export untuk digunakan di file lain
// export default firebaseConfig;
