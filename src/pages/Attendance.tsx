import { useState, useEffect, useRef } from 'react';
import { figmaStorage } from '../services/figmaStorage';
import { AttendanceRecord } from '../types';

function fmt(ms:number){const m=Math.floor(ms/6e4);return `${Math.floor(m/60)}j ${m%60}m`}
function today(r:AttendanceRecord[]){const t=new Date();return r.filter(x=>new Date(x.date).toDateString()===t.toDateString())}
function active(r:AttendanceRecord[]){return today(r).find(x=>!x.checkout)||null}
function sum(r:AttendanceRecord[]){return r.reduce((t,x)=>{const s=new Date(x.checkin),e=x.checkout?new Date(x.checkout):new Date();return t+(e.getTime()-s.getTime())},0)}

export default function Attendance() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [now, setNow] = useState(Date.now());
  const tr = useRef<number>(0);
  const ses = active(data);

  useEffect(()=>{figmaStorage.getJSON<AttendanceRecord[]>('vc_absensi',[]).then(setData)},[]);
  useEffect(()=>{clearInterval(tr.current);if(ses)tr.current=window.setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(tr.current)},[ses]);

  const ci=()=>{const n=new Date();const nx=[...data,{id:Date.now(),date:n.toISOString(),checkin:n.toISOString(),checkout:null}];setData(nx);figmaStorage.setJSON('vc_absensi',nx)};
  const co=()=>{if(!ses)return;const nx=data.map(r=>r.id===ses.id?{...r,checkout:new Date().toISOString()}:r);setData(nx);figmaStorage.setJSON('vc_absensi',nx)};

  const el=ses?Date.now()-new Date(ses.checkin).getTime():0;
  const ts=ses?`${String(Math.floor(el/3600000)).padStart(2,'0')}:${String(Math.floor((el%3600000)/60000)).padStart(2,'0')}:${String(Math.floor((el%60000)/1000)).padStart(2,'0')}`:'--:--:--';

  return (
    <div className="screen">
      <div className="card">
        <div className="att-head">
          <div className="att-icon">{ses?'📥':'⏳'}</div>
          <h2>{ses?'Sedang check-in':'Belum check-in'}</h2>
          <div className="att-timer">{ts}</div>
        </div>
        <div className="att-acts">
          <button className="btn btn-primary" onClick={ci} disabled={!!ses}>📥 Check In</button>
          <button className="btn btn-outline" onClick={co} disabled={!ses}>📤 Check Out</button>
        </div>
        <div className="att-stats">
          <div className="att-stat"><span className="att-num">{fmt(sum(today(data)))}</span><span className="att-lbl">Hari Ini</span></div>
          <div className="att-stat"><span className="att-num">{data.length}</span><span className="att-lbl">Sesi</span></div>
          <div className="att-stat"><span className="att-num">{fmt(sum(data))}</span><span className="att-lbl">Total</span></div>
        </div>
        <h3 className="section-title">Riwayat</h3>
        {[...data].sort((a,b)=>new Date(b.checkin).getTime()-new Date(a.checkin).getTime()).slice(0,10).map(r => {
          const s=new Date(r.checkin), e=r.checkout?new Date(r.checkout):null;
          return (
            <div key={r.id} className="att-row">
              <span className="att-row-icon">{e?'✅':'🟢'}</span>
              <div className="att-row-body">
                <div className="att-row-date">{s.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'})}</div>
                <div className="att-row-detail">{s.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}{e?' — '+e.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}):' — ...'}</div>
              </div>
              <span className="att-row-h">{e?fmt(e.getTime()-s.getTime()):'...'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
