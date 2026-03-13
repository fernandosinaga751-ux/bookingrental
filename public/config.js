// ═══════════════════════════════════════════════════════════════════
//  config.js — Dearma Jaya Transport
//  EDIT FILE INI SESUAI KEBUTUHAN ANDA
// ═══════════════════════════════════════════════════════════════════

// ── 1. FIREBASE (Database) ──────────────────────────────────────
//  Ambil dari: Firebase Console → Project Settings → Your apps → Web
const FIREBASE_CONFIG = {
  apiKey:            "GANTI_API_KEY",
  authDomain:        "GANTI_PROJECT_ID.firebaseapp.com",
  projectId:         "GANTI_PROJECT_ID",
  storageBucket:     "GANTI_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_SENDER_ID",
  appId:             "GANTI_APP_ID"
};

// ── 2. CLOUDFLARE R2 Public URL ─────────────────────────────────
//  URL publik bucket R2 Anda (tanpa slash di akhir)
//  Contoh: https://pub-xxxxxxxxxxxx.r2.dev
//  Atau custom domain: https://files.dearmarental.com
const R2_PUBLIC_URL = "https://GANTI_R2_PUBLIC_URL";

// ── 3. ADMIN ────────────────────────────────────────────────────
const ADMIN_PASS = "admin123";   // ← GANTI password admin

// ── 4. WHATSAPP ─────────────────────────────────────────────────
const WA_NUMBER = "6281234567890"; // ← GANTI nomor WA bisnis (tanpa +)
