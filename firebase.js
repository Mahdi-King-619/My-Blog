// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIh5vRPXV6G_bMIO-xmM5QMMwuWSDkiEs",
    authDomain: "blog-91afe.firebaseapp.com",
    projectId: "blog-91afe",
    storageBucket: "blog-91afe.appspot.com",
    messagingSenderId: "998518328744",
    appId: "1:998518328744:web:a4b56031fe72ba3156e19d",
    measurementId: "G-07K8Z2VMSS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
