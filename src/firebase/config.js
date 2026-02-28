import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyC1NQWGv64kKR5PbKkbcaJgOXoVkJzPle8",
  authDomain: "blablacar-a6448.firebaseapp.com",
  projectId: "blablacar-a6448",
  storageBucket: "blablacar-a6448.firebasestorage.app",
  messagingSenderId: "615644049260",
  appId: "1:615644049260:web:66c24bf4f9da22d77f4d49",
  measurementId: "G-928F9RQH0J"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app)

export { auth, db, analytics }
