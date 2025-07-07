import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';

const VerifyCode = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const email = params.email as string;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/verify-code', {
        email,
        code,
      });

      const { token } = res.data;
      localStorage.setItem('adminToken', token);

     
      router.push('../dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código incorreto');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Verificação de Código</h2>
      <p>Um código foi enviado para <b>{email}</b></p>
      <input
        placeholder="Insere o código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br /><br />
      <button onClick={handleVerify}>Validar Código</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyCode;
