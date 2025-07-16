import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBa4-wNDyEMcz9ovSNcNIXYUI5H6_jXw",
  authDomain: "rehber-web-projesi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rehber-web-projesi",
  storageBucket: "rehber-web-projesi.appspot.com",
  messagingSenderId: "711919432528",
  appId: "1:711919432528:web:5de85f9d43523d5be67d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };