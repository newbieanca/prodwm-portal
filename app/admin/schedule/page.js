'use client';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function AdminSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', month:'', year:new Date().getFullYear() });
  const [parsed, setParsed] = useState([]);
  const [actuals, setActuals] = useState({});
  const months=['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  const load = () => fetch('/api/schedule').then(r=>r.json()).then(setSchedules);
  useEffect(()=>{ load(); },[]);

  async function loadDetail(id) {
    setSelected(id);
    const res = await fetch(`/api/schedule/${id}`);
    const d = await res.json();
    setDetail(d);
    const ai={};
    d.items?.forEach(i=>{ ai[i.date.split('T')[0]]=i.actual_output??''; });
    setActuals(ai);
  }

  function handleFile(e) {
    const file = e.target.files[0]; if(!file)return;
    const reader = new FileReader();
    reader.onload = evt => {
      const wb = XLSX.read(evt.target.result,{type:'array'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws,{header:1});
      const items=[];
      for(let i=1;i<rows.length;i++){
        const [dv,pl]=rows[i]; if(!dv||!pl)continue;
        let date;
        if(typeof dv==='number'){ const d=new Date(Math.round((dv-25569)*86400*1000)); date=d.toISOString().split('T')[0]; }
        else { date=new Date(dv).toISOString().split('T')[0]; }
        items.push({date,planned_output:parseInt(pl)});
      }
      setParsed(items);
    };
    reader.readAsArrayBuffer(file);
  }

  async function upload(e) {
    e.preventDefault();
    if(!parsed.length){alert('Upload file Excel terlebih dahulu');return;}
    const res = await fetch('/api/schedule',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form,items:parsed}) });
    if(!res.ok){alert((await res.json()).error);return;}
    setShowForm(false); setParsed([]); load();
  }

  async function saveActual(date) {
    await fetch(`/api/schedule/${selected}/actual`,{ method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({date,actual_output:parseInt(actuals[date])||0}) });
    loadDetail(selected);
  }

  return (
    <>
      <div className="page-header"><h1>📅 Jadwal Produksi</h1><button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Upload Jadwal</button></div>
      {showForm&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal">
            <h2>Upload Jadwal Produksi</h2>
            <p style={{fontSize:13,color:'#666',marginBottom:12}}>Format Excel: Kolom A=Tanggal (YYYY-MM-DD), Kolom B=Target. Baris 1=header.</p>
            <form onSubmit={upload}>
              <div className="form-group"><label>Judul *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Jadwal Produksi WM Mei 2025" required /></div>
              <div className="grid-2">
                <div className="form-group"><label>Bulan *</label><select value={form.month} onChange={e=>setForm(f=>({...f,month:e.target.value}))} required><option value="">Pilih Bulan</option>{months.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}</select></div>
                <div className="form-group"><label>Tahun *</label><input type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))} required /></div>
              </div>
              <div className="form-group"><label>File Excel *</label><input type="file" accept=".xlsx,.xls" onChange={handleFile} /></div>
              {parsed.length>0&&<div style={{background:'#f0fdf4',borderRadius:6,padding:10,marginBottom:12,fontSize:13}}>✅ {parsed.length} baris data terbaca. Contoh: {parsed[0]?.date} → {parsed[0]?.planned_output} unit</div>}
              <div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button><button type="submit" className="btn btn-primary">Upload</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="grid-2">
        <div className="card">
          <h3 style={{marginBottom:12}}>Jadwal Tersedia</h3>
          {schedules.map(s=>(<div key={s.id} onClick={()=>loadDetail(s.id)} style={{padding:'10px 12px',borderRadius:6,cursor:'pointer',background:selected===s.id?'#eff6ff':'transparent',borderBottom:'1px solid #eee'}}><div style={{fontWeight:600,fontSize:14}}>{s.title}</div><div style={{fontSize:13,color:'#666'}}>{months[s.month]} {s.year}</div></div>))}
        </div>
        <div className="card" style={{overflow:'auto'}}>
          {!detail&&<p style={{color:'#999',fontSize:14}}>Pilih jadwal</p>}
          {detail&&(
            <>
              <h3 style={{marginBottom:8}}>{detail.title}</h3>
              <div style={{display:'flex',gap:10,marginBottom:12,flexWrap:'wrap'}}>
                <div style={{background:'#eff6ff',borderRadius:6,padding:'6px 12px',fontSize:13}}>Target: <strong>{detail.planned_total?.toLocaleString()}</strong></div>
                <div style={{background:'#f0fdf4',borderRadius:6,padding:'6px 12px',fontSize:13}}>Aktual: <strong>{detail.actual_total?.toLocaleString()}</strong></div>
                <div style={{background:'#fef2f2',borderRadius:6,padding:'6px 12px',fontSize:13}}>Sisa: <strong>{detail.remaining?.toLocaleString()}</strong></div>
              </div>
              <table>
                <thead><tr><th>Tanggal</th><th>Target</th><th>Aktual</th><th>Simpan</th></tr></thead>
                <tbody>
                  {detail.items?.map(item=>{
                    const ds=item.date.split('T')[0];
                    return(<tr key={item.id}>
                      <td>{new Date(item.date).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</td>
                      <td>{item.planned_output?.toLocaleString()}</td>
                      <td><input type="number" value={actuals[ds]??''} min="0" onChange={e=>setActuals(a=>({...a,[ds]:e.target.value}))} style={{width:80,padding:'3px 7px'}} /></td>
                      <td><button className="btn btn-primary btn-sm" onClick={()=>saveActual(ds)}>✓</button></td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}