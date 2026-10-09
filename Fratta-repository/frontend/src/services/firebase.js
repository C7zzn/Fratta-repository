// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// As suas credenciais do projeto Fratta Memorial
const firebaseConfig = {
  apiKey: "AIzaSyCJQQRYrgK_7AXq_O2rRbgyhsQYkeOY0_Q",
  authDomain: "fratta-memorial.firebaseapp.com",
  projectId: "fratta-memorial",
  storageBucket: "fratta-memorial.firebasestorage.app",
  messagingSenderId: "1098820951473",
  appId: "1:1098820951473:web:fb77d61c262b175f97f190",
  measurementId: "G-4LYQHNSHDW"
};

// Inicializa o Firebase no seu projeto
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportamos o Auth (para o login) e o DB (para o banco de dados)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Garante que o administrador continue logado mesmo atualizando a página ou fechando o navegador
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Erro ao definir persistência do auth:", error);
});