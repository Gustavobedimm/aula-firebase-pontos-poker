import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZXKWLHfEJWE-Qmh_QFSsr-mIvtVp0mSk",
  authDomain: "aulas-8a13d.firebaseapp.com",
  projectId: "aulas-8a13d",
  storageBucket: "aulas-8a13d.appspot.com",
  messagingSenderId: "108011201445",
  appId: "1:108011201445:web:cd4ee292e3c977e1dbbe4c",
  measurementId: "G-4K8K4Z3SRV"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseapp);

export {db};