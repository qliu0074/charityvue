import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBmuzquzXoqQUAKfeMxb_rsAEuWvRM68RI",
  authDomain: "charity-0074.firebaseapp.com",
  projectId: "charity-0074",
  storageBucket: "charity-0074.firebasestorage.app",
  messagingSenderId: "73541990659",
  appId: "1:73541990659:web:7a007d5f5dede87966d136",
  measurementId: "G-LJ1CKZEZ5C"
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db
