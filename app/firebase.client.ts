import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzNw9hNhNS23VXbWXV2m8ISC0AEvrijlg",
  authDomain: "mobmun-986a2.firebaseapp.com",
  projectId: "mobmun-986a2",
  storageBucket: "mobmun-986a2.appspot.com",
  messagingSenderId: "121723272179",
  appId: "1:121723272179:web:1f257b1e58db635eedb086",
  measurementId: "G-6MT7Q32ZCF",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
