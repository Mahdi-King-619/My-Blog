// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVPNd_aYCdUyVR9uhnX1L9YESSWN_Wi0U",
    authDomain: "my-blog-c7080.firebaseapp.com",
    projectId: "my-blog-c7080",
    storageBucket: "my-blog-c7080.firebasestorage.app",
    messagingSenderId: "1051971787441",
    appId: "1:1051971787441:web:26a17a2e42e09e2162090",
    measurementId: "G-MCVG1WKV73"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
