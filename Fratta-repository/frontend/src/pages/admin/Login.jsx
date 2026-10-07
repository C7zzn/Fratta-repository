import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../services/firebase";


export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('E-mail ou senha incorretos.');
      console.error(err);
    }
  };

  return (
    <div className="login-container" style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--txt)' }}>
      <div className="login-card" style={{ maxWidth: '400px', margin: '0 auto', background: 'var(--aescuro)', padding: '30px', borderRadius: '15px', border: '1px solid var(--aclaro)' }}>
        <h2>Área Restrita - Memorial</h2>
        <p style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.8 }}>Acesso exclusivo para administradores.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="E-mail de acesso"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--aclaro)', background: 'var(--bg)', color: 'var(--txt)' }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--aclaro)', background: 'var(--bg)', color: 'var(--txt)' }}
          />
          <button type="submit" style={{ padding: '10px', background: 'var(--aclaro)', color: 'var(--bg)', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Entrar
          </button>
          {error && <p style={{ color: '#ff4d4d', fontSize: '14px' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}