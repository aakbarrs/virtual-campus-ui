import { useState, useEffect } from 'react';
import { figmaStorage } from '../services/figmaStorage';

export default function Settings() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState('id');

  useEffect(() => {
    figmaStorage.get('vc_dark').then(v => { if (v === 'true') { setDark(true); document.documentElement.setAttribute('data-theme', 'dark'); } });
  }, []);

  const toggle = () => { setDark(p => { const n = !p; document.documentElement.setAttribute('data-theme', n ? 'dark' : ''); figmaStorage.set('vc_dark', String(n)); return n; }); };

  return (
    <div className="screen">
      <div className="card">
        <h3 className="section-title">Tampilan</h3>
        <div className="set-row"><span>{dark?'☀️':'🌙'} {dark?'Mode Terang':'Mode Gelap'}</span><button className="toggle" onClick={toggle} style={{background:dark?'var(--success)':'var(--border-2)'}}><span style={{transform:dark?'translateX(20px)':'translateX(0)'}}/></button></div>
        <div className="set-row"><span>🌐 Bahasa</span><select value={lang} onChange={e=>setLang(e.target.value)} className="sel"><option value="id">Indonesia</option><option value="en">English</option><option value="es">Español</option></select></div>
      </div>
      <div className="card">
        <h3 className="section-title">Notifikasi</h3>
        <div className="set-row"><span>🔔 Push</span><span className="toggle" style={{background:'var(--success)'}}><span style={{transform:'translateX(20px)'}}/></span></div>
        <div className="set-row"><span>📧 Email</span><span className="toggle" style={{background:'var(--border-2)'}}><span/></span></div>
      </div>
      <div className="card">
        <h3 className="section-title">Tentang</h3>
        <div className="set-row"><span>Versi</span><span className="set-val">2.0.0</span></div>
        <div className="set-row"><span>Virtual Campus</span><span className="set-val">IMK 2026</span></div>
      </div>
    </div>
  );
}
