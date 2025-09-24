// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDy66Z9-1kP90nQMB_WgxLQhs5YK39Ipag',
  authDomain: 'baytak-14484.firebaseapp.com',
  projectId: 'baytak-14484',
  storageBucket: 'baytak-14484.firebasestorage.app',
  messagingSenderId: '138112039953',
  appId: '1:138112039953:web:ebd25eb6393052dae585b0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
export { app as firebaseApp, db as firebaseDb, auth as firebaseAuth }
