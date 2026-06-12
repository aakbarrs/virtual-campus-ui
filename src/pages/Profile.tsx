import { useState, useEffect } from 'react';
import { figmaStorage } from '../services/figmaStorage';

export default function Profile() {
  const [user, setUser] = useState<{name:string;email:string}|null>(null);
  useEffect(() => { figmaStorage.get('vc_token').then(t => { if (t) try { setUser(JSON.parse(atob(t.split('.')[1]))); } catch {}}); }, []);

  return (
    <div className="screen">
      <div className="card">
        <div className="p-hero">
          <div className="p-av">{user?.name?.charAt(0)?.toUpperCase()||'A'}</div>
          <h2>{user?.name||'Akbar Saputra'}</h2>
          <p>{user?.email||'akbar@email.com'}</p>
        </div>
        <div className="p-row"><span>🎓</span><div><strong>Teknik Informatika</strong><span>Program Studi</span></div></div>
        <div className="p-row"><span>📋</span><div><strong>IF-48-10</strong><span>Kelas</span></div></div>
        <div className="p-row"><span>📅</span><div><strong>2024 - Sekarang</strong><span>Masa Studi</span></div></div>
        <hr />
        <h3 className="section-title">Kontak</h3>
        <div className="p-row"><span>📧</span><div><strong>{user?.email||'akbar@email.com'}</strong><span>Email</span></div></div>
        <div className="p-row"><span>📱</span><div><strong>+62 812-3456-7890</strong><span>Telepon</span></div></div>
      </div>
    </div>
  );
}
