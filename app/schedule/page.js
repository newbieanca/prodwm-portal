'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const months = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  useEffect(()=>{ fetch('/api/schedule').then(r=>r.json()).then(setSchedules); },[]);

  async function loadDetail(id) {
    setSelected(id);
    const res = await fetch(`/api/schedule/${id}`);
    setDetail(await res.json());
  }

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header"><h1>📅 Jadwal Produksi</h1></div>
        <div className="grid-2">
          <div className="card">
            <h3 style={{marginBottom:12}}>Jadwal Tersedia</h3>
            {schedules.length===0&&<p style={{color:'#999',fontSize:14}}>Belum ada jadwal.</p>}
            {schedules.map(s=>(
              <div key={s.id} onClick={()=>loadDetail(s.id)}
                style={{padding:'10px 12px',borderRadius:6,cursor:'pointer',background:selected===s.id?'#eff6ff':'transparent',borderBottom:'1px solid #eee'}}>
                <div style={{fontWeight:600,fontSize:14}}>{s.title}</div>
                <div style={{fontSize:13,color:'#666'}}>{months[s.month]} {s.year}</div>
              </div>
            ))}
          </div>
          <div className="card">
            {!detail&&<p style={{color:'#999',fontSize:14}}>Pilih jadwal untuk melihat detail</p>}
            {detail&&(
              <>
                <h3 style={{marginBottom:8}}>{detail.title}</h3>
                <div style={{display:'flex',gap:12,marginBottom:14,flexWrap:'wrap'}}>
                  <div className="stat-card" style={{flex:1,minWidth:90,padding:12}}>
                    <div className="value" style={{fontSize:18}}>{detail.planned_total?.toLocaleString()}</div>
                    <div className="label">Target</div>
                  </div>
                  <div className="stat-card" style={{flex:1,minWidth:90,padding:12}}>
                    <div className="value" style={{fontSize:18,color:'#059669'}}>{detail.actual_total?.toLocaleString()}</div>
                    <div className="label">Aktual</div>
                  </div>
                  <div className="stat-card" style={{flex:1,minWidth:90,padding:12}}>
                    <div className="value" style={{fontSize:18,color:'#dc2626'}}>{detail.remaining?.toLocaleString()}</div>
                    <div className="label">Sisa</div>
                  </div>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table>
                    <thead><tr><th>Tanggal</th><th>Target</th><th>Aktual</th><th>%</th></tr></thead>
                    <tbody>
                      {detail.items?.map(item=>{
                        const pct=item.actual_output!=null?Math.round((item.actual_output/item.planned_output)*100):null;
                        return(
                          <tr key={item.id}>
                            <td>{new Date(item.date).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</td>
                            <td>{item.planned_output?.toLocaleString()}</td>
                            <td>{item.actual_output!=null?item.actual_output.toLocaleString():<span style={{color:'#999'}}>-</span>}</td>
                            <td>{pct==null?<span className="badge badge-gray">-</span>:pct>=100?<span className="badge badge-green">{pct}%</span>:<span className="badge badge-red">{pct}%</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}