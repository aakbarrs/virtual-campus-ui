import { useState } from 'react';

export default function Register({ onNav }: { onNav: (s: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (pass.length < 6) { setErr('Password minimal 6 karakter'); return; }
    const users = JSON.parse(localStorage.getItem('vc_standalone_users') || '[]');
    if (users.find((u: any) => u.email === email)) { setErr('Email sudah terdaftar'); return; }
    users.push({ id: Date.now(), name, email, password: pass });
    localStorage.setItem('vc_standalone_users', JSON.stringify(users));
    onNav('login');
  };

  return (
    <div className="screen">
      <div className="card auth-card">
        <div className="auth-brand">
          <svg viewBox="0 0 40 40" width="44" height="44" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="16" cy="12" r="5"/><path d="M6 32c0-6 4.5-10 10-10s10 4 10 10"/><path d="M26 10l4 4 8-8"/></svg>
          <h1>Virtual Campus</h1>
          <p>Buat akun baru</p>
        </div>
        {err && <div className="err">{err}</div>}
        <form onSubmit={submit}>
          <div className="field"><label>Nama</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" required /></div>
          <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required /></div>
          <div className="field"><label>Password</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Minimal 6 karakter" required /></div>
          <button className="btn btn-primary" type="submit">Daftar</button>
        </form>
        <p className="auth-foot">Sudah punya akun? <button className="link" onClick={() => onNav('login')}>Masuk</button></p>
      </div>
    </div>
  );
}
