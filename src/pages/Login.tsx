import { useState } from 'react';
import { figmaStorage } from '../services/figmaStorage';

export default function Login({ onNav }: { onNav: (s: string) => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    try {
      const users = JSON.parse(localStorage.getItem('vc_standalone_users') || '[]');
      const u = users.find((x: any) => x.email === email);
      if (u && u.password === pass) {
        await figmaStorage.set('vc_token', btoa(JSON.stringify({ id: u.id, name: u.name, email: u.email })));
        onNav('dashboard'); return;
      }
      if (email === 'akbar@example.com' && pass === 'password123') {
        await figmaStorage.set('vc_token', btoa(JSON.stringify({ id: 1, name: 'Akbar Saputra', email: 'akbar@example.com' })));
        onNav('dashboard'); return;
      }
      setErr('Email atau password salah');
    } catch { setErr('Terjadi kesalahan'); }
  };

  return (
    <div className="screen">
      <div className="card auth-card">
        <div className="auth-brand">
          <svg viewBox="0 0 40 40" width="44" height="44" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M20 4L4 14v4l16 10 16-10v-4L20 4z"/><path d="M4 22v6l16 10 16-10v-6"/><rect x="16" y="14" width="8" height="6" rx="1"/></svg>
          <h1>Virtual Campus</h1>
          <p>Masuk ke portal akademik</p>
        </div>
        {err && <div className="err">{err}</div>}
        <form onSubmit={login}>
          <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required /></div>
          <div className="field"><label>Password</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••" required /></div>
          <button className="btn btn-primary" type="submit">Masuk</button>
        </form>
        <p className="auth-foot">Belum punya akun? <button className="link" onClick={() => onNav('register')}>Daftar</button></p>
      </div>
    </div>
  );
}
