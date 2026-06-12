import { useState } from 'react';
import { scheduleData, dayKeys } from '../data/mockData';

const dl: Record<string,string> = { senin:'Senin', selasa:'Selasa', rabu:'Rabu', kamis:'Kamis', jumat:'Jumat' };

export default function Schedule() {
  const [day, setDay] = useState('senin');
  const items = scheduleData.filter(s => s.day === day).sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="screen">
      <div className="card">
        <div className="sch-chips">
          {dayKeys.map(d => <button key={d} className={`sch-chip ${day===d?'active':''}`} onClick={() => setDay(d)}>{dl[d]}</button>)}
        </div>
        {items.map(s => (
          <div key={s.id} className="s-row">
            <div className="s-bar" style={{background:s.color}}></div>
            <div className="s-body">
              <div className="s-course">{s.course}</div>
              <div className="s-meta">📍 {s.room}</div>
              <div className="s-meta">👤 {s.lecturer}</div>
            </div>
            <div className="s-time">{s.start} &mdash; {s.end}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
