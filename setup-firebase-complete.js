/**
 * ============================================================
 * DRIVE ZONE - FIREBASE SETUP SCRIPT (COMPLETE)
 * ============================================================
 * 
 * Email Admin: fernandosinaga751@gmail.com
 * Password: IvanaIsabel2225
 * 
 * INSTRUKSI PENGgunaAN:
 * 1. Install Node.js (https://nodejs.org)
 * 2. Buka terminal/command prompt
 * 3. Jalankan: npm install -g firebase-tools
 * 4. Jalankan: firebase login
 * 5. Jalankan: firebase init
 * 6. Pilih project "drive-zone-rental"
 * 7. Copy file ini ke folder functions/index.js
 * 8. Jalankan: firebase deploy
 * ============================================================
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// ============================================================
// CLOUD FUNCTION: Set Admin Claim
// ============================================================
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Verifikasi caller sudah login
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Silakan login terlebih dahulu');
  }
  
  const { uid } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID harus disediakan');
  }
  
  try {
    // Set custom claim admin: true
    await auth.setCustomUserClaims(uid, { admin: true });
    
    // Update user document di Firestore
    await db.collection('admins').doc(uid).set({
      email: context.auth.token.email,
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      message: 'Admin claim berhasil di-set untuk UID: ' + uid 
    };
  } catch (error) {
    console.error('Error setting admin claim:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================
// CLOUD FUNCTION: Seed Data Mobil (Run once)
// ============================================================
exports.seedCars = functions.https.onRequest(async (req, res) => {
  // Hanya bisa diakses via POST dengan secret key
  const secretKey = req.headers['x-secret-key'];
  if (secretKey !== 'drivezone2025') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const cars = {
    avanza: {
      label: 'New Avanza 2024',
      price: 350000,
      img: '1000537007.png',
      description: '7 seats, AC, Manual/Automatic',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    innova_reborn: {
      label: 'Innova Reborn',
      price: 500000,
      img: '1000537006.jpg',
      description: '8 seats, AC, Automatic',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    innova_zenix: {
      label: 'Innova Zenix',
      price: 550000,
      img: '1000537006.jpg',
      description: '7 seats, AC, Hybrid',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    fortuner: {
      label: 'Fortuner 2024',
      price: 750000,
      img: '1000537008.jpg',
      description: '7 seats, 4x4, AC, Automatic',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    pajero: {
      label: 'Pajero 2024',
      price: 800000,
      img: '1000537014.jpg',
      description: '7 seats, 4x4, AC, Automatic',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    alphard_2023: {
      label: 'Alphard 2023',
      price: 1500000,
      img: '1000537012.jpg',
      description: '7 seats, Luxury, AC, Automatic',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    alphard_2025: {
      label: 'New Alphard 2025',
      price: 1800000,
      img: '1000537013.jpg',
      description: '7 seats, Premium Luxury, AC, Automatic',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    hiace_commuter: {
      label: 'Hiace Commuter',
      price: 900000,
      img: '1000537011.jpg',
      description: '15 seats, AC, Manual',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    hiace_premio: {
      label: 'Hiace Premio',
      price: 1100000,
      img: '1000537010.jpg',
      description: '13 seats, Premium, AC, Automatic',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  };
  
  try {
    const batch = db.batch();
    
    Object.entries(cars).forEach(([id, data]) => {
      const ref = db.collection('cars').doc(id);
      batch.set(ref, data);
    });
    
    await batch.commit();
    
    res.json({ 
      success: true, 
      message: 'Data mobil berhasil di-seed',
      count: Object.keys(cars).length
    });
  } catch (error) {
    console.error('Error seeding cars:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// CLOUD FUNCTION: Create Admin User
// ============================================================
exports.createAdminUser = functions.https.onRequest(async (req, res) => {
  // Hanya bisa diakses via POST dengan secret key
  const secretKey = req.headers['x-secret-key'];
  if (secretKey !== 'drivezone2025') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const email = 'fernandosinaga751@gmail.com';
  const password = 'IvanaIsabel2225';
  
  try {
    // Cek apakah user sudah ada
    let user;
    try {
      user = await auth.getUserByEmail(email);
      // Update password jika sudah ada
      await auth.updateUser(user.uid, { password });
    } catch (error) {
      // Buat user baru jika belum ada
      user = await auth.createUser({
        email,
        password,
        emailVerified: true
      });
    }
    
    // Set admin claim
    await auth.setCustomUserClaims(user.uid, { admin: true });
    
    // Simpan ke Firestore
    await db.collection('admins').doc(user.uid).set({
      email,
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Admin user berhasil dibuat/diupdate',
      uid: user.uid,
      email
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// CLOUD FUNCTION: Backup Bookings (Scheduled)
// ============================================================
exports.backupBookings = functions.pubsub.schedule('0 0 * * *') // Setiap hari jam 00:00
  .timeZone('Asia/Jakarta')
  .onRun(async (context) => {
    try {
      const snapshot = await db.collection('bookings').get();
      const backups = {};
      
      snapshot.forEach(doc => {
        backups[doc.id] = doc.data();
      });
      
      // Simpan ke collection backups dengan timestamp
      const backupId = new Date().toISOString().split('T')[0];
      await db.collection('backups').doc(backupId).set({
        data: backups,
        count: snapshot.size,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Backup berhasil: ${snapshot.size} bookings`);
      return null;
    } catch (error) {
      console.error('Backup error:', error);
      return null;
    }
  });

// ============================================================
// TRIGGER: On New Booking - Send Notification
// ============================================================
exports.onNewBooking = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const bookingId = context.params.bookingId;
    
    console.log(`Booking baru: ${bookingId} - ${booking.nama}`);
    
    // Bisa tambah integrasi WhatsApp API di sini
    // Bisa tambah email notification di sini
    
    return null;
  });

// ============================================================
// TRIGGER: On Booking Update - Log Changes
// ============================================================
exports.onBookingUpdate = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const bookingId = context.params.bookingId;
    
    // Log perubahan status
    if (before.status !== after.status) {
      await db.collection('auditLogs').add({
        bookingId,
        action: 'status_change',
        from: before.status,
        to: after.status,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return null;
  });

// ============================================================
// HTTP FUNCTION: Get Stats (Untuk Dashboard)
// ============================================================
exports.getStats = functions.https.onCall(async (data, context) => {
  // Verifikasi admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Hanya admin yang bisa akses');
  }
  
  try {
    const bookingsSnapshot = await db.collection('bookings').get();
    const bookings = [];
    
    bookingsSnapshot.forEach(doc => {
      bookings.push(doc.data());
    });
    
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      active: bookings.filter(b => b.status === 'active').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      unpaid: bookings.filter(b => b.paymentStatus === 'unpaid' && b.status !== 'completed').length,
      totalRevenue: bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

console.log('Drive Zone Firebase Functions loaded successfully!');
