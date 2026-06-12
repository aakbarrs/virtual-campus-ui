import { useState } from 'react';
import { gradesData } from '../data/mockData';

const gc: Record<string,string> = { A:'ga','A-':'ga','B+':'gb',B:'gb','B-':'gb','C+':'gc',C:'gc',D:'gd',E:'ge' };

export default function Grades() {
  const [sem, setSem] = useState('all');
  const ds = sem === 'all' ? gradesData : gradesData.filter(s => s.name === sem);
  let ts=0, tw=0, tc=0;
  gradesData.forEach(s => { tw += s.gpa * s.totalSks; tc += s.totalSks; });
  ds.forEach(s => ts += s.totalSks);

  return (
    <div className="screen">
      <div className="card">
        <div className="g-sum">
          <div className="g-item"><span className="g-val">{ds.length===1?ds[0].gpa.toFixed(2):'-'}</span><span className="g-lbl">IP Semester</span></div>
          <div className="g-item"><span className="g-val">{(tw/tc).toFixed(2)}</span><span className="g-lbl">IP Kumulatif</span></div>
          <div className="g-item"><span className="g-val">{ts}</span><span className="g-lbl">SKS</span></div>
        </div>
        <div className="g-chips">
          {gradesData.map(s => <button key={s.name} className={`g-chip ${sem===s.name?'active':''}`} onClick={()=>setSem(s.name)}>{s.name}</button>)}
        </div>
        {ds.map(sm => sm.courses.map((c, i) => (
          <div key={i} className="g-card">
            <div className="g-hdr"><strong>{c.name}</strong><span className="g-sks">{c.sks} SKS</span></div>
            <div className="g-comps">
              {c.components.tugas!==undefined&&<div className="g-comp"><span className="g-cv">{c.components.tugas}</span><span className="g-cl">Tgs</span></div>}
              {c.components.uts!==undefined&&<div className="g-comp"><span className="g-cv">{c.components.uts}</span><span className="g-cl">UTS</span></div>}
              {c.components.uas!==undefined&&<div className="g-comp"><span className="g-cv">{c.components.uas}</span><span className="g-cl">UAS</span></div>}
              {c.components.praktikum!==undefined&&<div className="g-comp"><span className="g-cv">{c.components.praktikum}</span><span className="g-cl">Prak</span></div>}
            </div>
            <div className="g-foot"><span className={`g-grade ${gc[c.grade]||'gb'}`}>{c.grade}</span><span className={`g-status ${c.passed?'ok':'no'}`}>{c.passed?'Lulus':'Tidak'}</span></div>
          </div>
        )))}
      </div>
    </div>
  );
}
