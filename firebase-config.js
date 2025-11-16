// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEhxe3Q4fFKtOsmxyF6xJJeP5jW3eYgd8",
    authDomain: "personal-website-7b7ae.firebaseapp.com",
    projectId: "personal-website-7b7ae",
    storageBucket: "personal-website-7b7ae.firebasestorage.app",
    messagingSenderId: "1052758306648",
    appId: "1:1052758306648:web:38d5d4c32af309dd16ff2d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDB = db;
