import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = btoa(`${usuario}:${password}`);

    try {
      const res = await fetch('http://localhost:8080/api/solicitudes?estado=PENDIENTE', {
        headers: { 'Authorization': `Basic ${token}` }
      });

      if (res.ok) {
        localStorage.setItem('adminToken', token);
        navigate('/admin'); 
      } else {
        setError('Credenciales incorrectas. Acceso denegado.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>Acceso Administrativo</h2>
        
        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.5rem' }}>
          <FaUser style={{ color: '#9ca3af', marginRight: '10px' }} />
          <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} required />
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.5rem' }}>
          <FaLock style={{ color: '#9ca3af', marginRight: '10px' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} required />
        </div>

        <button type="submit" style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}