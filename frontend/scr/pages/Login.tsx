import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin-auth/login', {
        email,
        password,
      });

      setStep('2fa');
      setMessage('📧 Código 2FA enviado para o email.');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin-auth/verify-2fa', {
        email,
        code,
      });

      localStorage.setItem('adminToken', res.data.token); // armazenas corretamente
      setMessage('✅ Login realizado com sucesso!');
      window.location.href = '/admin/dashboard'; // Redireciona
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Erro ao verificar código');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      <h2>BackOffice RacketMatch 🎾</h2>

      {step === 'login' && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />
          <input
            type="password"
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />
          <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
            Entrar
          </button>
        </>
      )}

      {step === '2fa' && (
        <>
          <p>🔐 Introduz o código 2FA enviado para o teu email</p>
          <input
            type="text"
            placeholder="Código de verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />
          <button onClick={handleVerifyCode} style={{ padding: '10px 20px' }}>
            Verificar Código
          </button>
        </>
      )}

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
