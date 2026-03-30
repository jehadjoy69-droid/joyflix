/**
 * Firestore rules (Firebase Console → Firestore → Rules):
 * match /users/{uid}/watchHistory/{docId} {
 *   allow read, write: if request.auth != null && request.auth.uid == uid;
 * }
 * Authentication: enable Email/Password, Google, GitHub in Firebase Console.
 */
var firebaseConfig = {
  apiKey: "AIzaSyDuQEK_8E3hLic0wYBuAjFKtSYF2scDKyQ",
  authDomain: "streamflix-2f21a.firebaseapp.com",
  projectId: "streamflix-2f21a",
  storageBucket: "streamflix-2f21a.firebasestorage.app",
  messagingSenderId: "736981420427",
  appId: "1:736981420427:web:236b5c761f16f2973e078e",
  measurementId: "G-Q46JHMSYNN"
};

try {
  if (typeof firebase !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    if (typeof firebase.analytics === "function") {
      firebase.analytics();
    }
  }
} catch (e) {
  console.warn("Firebase init failed.", e);
}
