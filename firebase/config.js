import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDnPSpjXL6F556JAe4D8ZgAxOztn523GCo",
  authDomain: "rn-social-fac3f.firebaseapp.com",
  databaseURL: "https://rn-social-fac3f-default-rtdb.firebaseio.com",
  projectId: "rn-social-fac3f",
  storageBucket: "rn-social-fac3f.appspot.com",
  messagingSenderId: "248278026503",
  appId: "1:248278026503:web:981495b3c55411feaddda2",
  measurementId: "G-XV22241E85",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
// export const db = getFirestore(app);
export const storage = getStorage(app);
export const databaseRef = ref;
