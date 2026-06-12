import { useState, useEffect } from 'react';
import { figmaStorage } from '../services/figmaStorage';
import { mockCourses } from '../data/mockData';

export default function Dashboard() {
  const [name, setName] = useState('Akbar');
  const [q, setQ] = useState('');
  const [f, setF] = useState('all');

  useEffect(() => {
    figmaStorage.get('vc_token').then(t => {
      if (t) try { setName(JSON.parse(atob(t.split('.')[1])).name); } catch {}
    });
    figmaStorage.get('vc_dark').then(v => { if (v === 'true') document.documentElement.setAttribute('data-theme', 'dark'); });
  }, []);

  const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="screen">
      <div className="card">
        <p className="dash-date">{date}</p>
        <h1 className="dash-title">Halo, {name}</h1>
        <input className="s-input" value={q} onChange={e => setQ(e.target.value)} placeholder="Cari kelas..." />
        <div className="chips">
          {['all','live','upcoming','idle'].map(t => (
            <button key={t} className={`chip ${f===t?'active':''}`} onClick={()=>setF(t)}>
              {t==='all'?'Semua':t==='live'?'Live':t==='upcoming'?'Akan datang':'Selesai'}
            </button>
          ))}
        </div>
        {mockCourses.filter(c => (!q||c.title.toLowerCase().includes(q.toLowerCase())) && (f==='all'||c.status===f)).map(c => (
          <div key={c.id} className="c-row">
            <div className={`c-icon ${c.status==='live'?'live':''}`}>{c.icon}</div>
            <div className="c-body">
              <h3>{c.title}</h3>
              <p>{c.status==='live'?'Bergabung sekarang':c.status==='upcoming'?`${c.schedule} • ${c.participants} peserta`:'Selesai'}</p>
            </div>
            <span className={`badge ${c.status==='live'?'b-live':c.status==='idle'?'b-idle':'b-soon'}`}>
              {c.status==='live'&&<span className="dot-pulse"/>}{c.status==='live'?'Live':c.status==='upcoming'?'Akan datang':'Selesai'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
