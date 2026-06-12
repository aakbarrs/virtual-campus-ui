import { useState, useEffect } from 'react';
import { figmaStorage } from '../services/figmaStorage';

export default function Meeting() {
  const [inRoom, setInRoom] = useState(false);
  const [tmr, setTmr] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!inRoom) return;
    const iv = setInterval(() => setTmr(x => x + 1), 1000);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(setStream).catch(() => {});
    return () => { clearInterval(iv); if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [inRoom]);

  const leave = () => { if (stream) stream.getTracks().forEach(t => t.stop()); setStream(null); setTmr(0); setInRoom(false); };

  if (inRoom) {
    return (
      <div className="meet-full">
        <div className="meet-top"><span>👥 1</span><span className="meet-code">ONLINE</span><span className="meet-timer">{String(Math.floor(tmr/60)).padStart(2,'0')}:{String(tmr%60).padStart(2,'0')}</span></div>
        <div className="meet-grid">
          <div className="meet-tile">
            <div className="meet-vid">{stream?<video autoPlay playsInline muted ref={v=>{if(v)v.srcObject=stream}} />:<div className="m-av">A</div>}</div>
            <div className="m-lbl">Anda</div>
          </div>
          <div className="meet-tile meet-wait">Menunggu peserta lain...</div>
        </div>
        <div className="meet-ctrl">
          <button className="m-btn">🎤</button>
          <button className="m-btn">📷</button>
          <button className="m-btn end" onClick={leave}>📞</button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="card">
        <div className="mtg-card" onClick={() => { const code=Array.from({length:8},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*30)]).join(''); figmaStorage.set('vc_meeting_code',code); setInRoom(true); }}>
          <div className="mtg-icon"><svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="var(--primary-2)" strokeWidth="2"><rect x="4" y="10" width="22" height="18" rx="3"/><path d="M26 16l10-5v16l-10-5"/></svg></div>
          <h3>Meeting Baru</h3>
          <p>Mulai meeting instan dengan orang lain</p>
          <button className="btn btn-primary" onClick={() => setInRoom(true)}>Buat Meeting</button>
        </div>
        <div className="mtg-card">
          <div className="mtg-icon"><svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="var(--primary-2)" strokeWidth="2"><path d="M22 14l-4 4M14 22l-4 4"/><path d="M18.34 9.66a4 4 0 015.66 0l6 6a4 4 0 010 5.66"/><path d="M21.66 30.34a4 4 0 01-5.66 0l-6-6a4 4 0 010-5.66"/></svg></div>
          <h3>Gabung Meeting</h3>
          <p>Masukkan kode meeting</p>
          <button className="btn btn-primary" onClick={() => setInRoom(true)}>Gabung</button>
        </div>
      </div>
    </div>
  );
}
