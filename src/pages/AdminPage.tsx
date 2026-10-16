import React, { useState, useEffect } from 'react';
import { isFirebaseConfigured, auth } from '../lib/firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { AdminLogin } from '../admin/AdminLogin.tsx';
import { AdminLayout } from '../admin/AdminLayout.tsx';

export const AdminPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    // Check if demo session is stored
    return localStorage.getItem('byrobsonbrito_admin_session');
  });
  const [checkingAuth, setCheckingAuth] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
          setCurrentUser(user.email || 'admin@byrobsonbrito.com.br');
        } else {
          setCurrentUser(null);
        }
        setCheckingAuth(false);
      });
      return () => unsubscribe();
    } else {
      setCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('byrobsonbrito_admin_session', email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('byrobsonbrito_admin_session');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-[#F2EEE8]">
        <span className="label-editorial text-xs">Verificando credenciais...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminLayout userEmail={currentUser} onLogout={handleLogout} />;
};
