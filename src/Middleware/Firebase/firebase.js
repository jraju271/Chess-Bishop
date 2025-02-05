import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD_D7QR18TA6x2_FYsw9ceGiD9qUeMmVjs",
//   authDomain: "sigaram64-6a5c2.firebaseapp.com",
//   projectId: "sigaram64-6a5c2",
//   storageBucket: "sigaram64-6a5c2.appspot.com",
//   messagingSenderId: "627321468001",
//   appId: "1:627321468001:web:4e4c1bea3cedda704b6620"
// };
const firebaseConfig = {
  apiKey: "AIzaSyB_zTupCq_bG9WIaV6qTEkyw2jmaW3GILU",
  authDomain: "chessbishop-d0f6a.firebaseapp.com",
  projectId: "chessbishop-d0f6a",
  storageBucket: "chessbishop-d0f6a.firebasestorage.app",
  messagingSenderId: "464544058676",
  appId: "1:464544058676:web:f6232aeb5641b0023ee961"
};


const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = getFirestore(app);
export const storage = getStorage(app);