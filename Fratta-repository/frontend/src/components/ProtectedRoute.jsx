import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Função para deslogar o usuário por inatividade
  const handleLogoutDueToInactivity = useCallback(async () => {
    try {
      await signOut(auth);
      setIsTimedOut(true);
    } catch (error) {
      console.error("Erro ao deslogar por inatividade:", error);
    }
  }, []);

  useEffect(() => {
    // 1. Monitora o estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Se não houver usuário logado, não precisa monitorar inatividade
    if (!user) return;

    // 40 minutos em milissegundos (40 * 60 * 1000 = 2.400.000 ms)
    const INACTIVITY_TIME = 40 * 60 * 1000; 
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogoutDueToInactivity();
      }, INACTIVITY_TIME);
    };

    // Lista de eventos que consideram que o usuário está ativo
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];

    // Adiciona os ouvintes de eventos na página
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Inicia o timer pela primeira vez
    resetTimer();

    // Limpeza dos eventos ao desmontar o componente ou deslogar
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, handleLogoutDueToInactivity]);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Carregando...</div>;
  }

  // Se expirou o tempo de inatividade ou o usuário não está logado, manda para o login
  if (!user || isTimedOut) {
    return <Navigate to="/login" replace />;
  }

  return children;
}