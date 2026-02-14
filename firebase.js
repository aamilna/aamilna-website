<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    onAuthStateChanged, signOut 
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { 
    getFirestore, collection, doc, setDoc, getDoc, addDoc, updateDoc, deleteDoc, query, where, getDocs
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

  // --- Firebase config ---
  const firebaseConfig = {
    apiKey: "AIzaSyCHMIBHlYGqyw4U7ZZplwi4LgQxga99nLM",
    authDomain: "aamilna.firebaseapp.com",
    projectId: "aamilna",
    storageBucket: "aamilna.appspot.com",
    messagingSenderId: "127180284017",
    appId: "1:127180284017:web:b024e50670228b085f7bd0"
  };

  // --- Initialize ---
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // --- Make globally accessible ---
  window.auth = auth;
  window.db = db;
  window.storage = storage;

  // --- Helper functions for login/signup ---
  window.signupUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error("Signup error:", err.message);
      throw err;
    }
  };

  window.loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error("Login error:", err.message);
      throw err;
    }
  };

  window.logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  // --- Observe auth state globally ---
  onAuthStateChanged(auth, (user) => {
    window.currentUser = user || null;
  });

  // --- Firestore helpers ---
  window.getUserDoc = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  window.setUserDoc = async (uid, data) => {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, data, { merge: true });
  };

  window.addProduct = async (data) => {
    const colRef = collection(db, "products");
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  };

  window.updateProduct = async (id, data) => {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, data);
  };

  window.deleteProduct = async (id) => {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  };

  window.getProductsByArtisan = async (artisanId) => {
    const q = query(collection(db, "products"), where("artisanId", "==", artisanId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  // --- Storage helpers ---
  window.uploadImage = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

</script>

