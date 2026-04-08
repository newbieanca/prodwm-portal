'use client';
import { useState, useEffect } from 'react';

export default function AdminECN() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ecn_number:'', title:'', description:'', issued_by:'', issued_date:'', status:'active', parts:[{part_number:'',part_name:'',change_description:''}] });
  const [error, setError] = useState('');

  const load = () => fetch('/api/ecn').then(r=>r.json()).then(setItems);
  useEffect(()=>{ load(); },[]);

  const addPart = () => setForm(f=>({...f,parts:[...f.parts,{part_number:'',part_name:'',change_description:''}]}));
  const removePart = i => setForm(f=>({...f,parts:f.parts.filter((_,idx)=>idx!==i)}));
  const updPart = (i,k,v) => setForm(f=>({...f,parts:f.parts.map((p,idx)=>idx===i?{...p,[k]:v}:p)}));

  async function save(e) {
    e.preventDefault(); setError('');
    const res = await fetch('/api/ecn',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    if (!res.ok) { setError((await res.json()).error); return; }
    setShowForm(false);
    setForm({ ecn_number:'', title:'', description:'', issued_by:'', issued_date:'', status:'active', parts:[{part_number:'',part_name:'',change_description:''}] });
    load();
  }

  return (
    <>
      <div className="page-header"><h1>📄 ECN / PKK</h1><button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Tambah ECN</button></div>
      {showForm&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal" style={{width:600}}>
            <h2>Tambah ECN</h2>
            {error&&<div className="alert alert-error">{error}</div>}
            <form onSubmit={save}>
              <div className="grid-2">
                <div className="form-group"><label>Nomor ECN *</label><input value={form.ecn_number} onChange={e=>setForm(f=>({...f,ecn_number:e.target.value}))} required /></div>
                <div className="form-group"><label>Status</label><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}><option value="active">Active</option><option value="obsolete">Obsolete</option></select></div>
              </div>
              <div className="form-group"><label>Judul *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required /></div>
              <div className="grid-2">
                <div className="form-group"><label>Diterbitkan oleh</label><input value={form.issued_by} onChange={e=>setForm(f=>({...f,issued_by:e.target.value}))} /></div>
                <div className="form-group"><label>Tanggal</label><input type="date" value={form.issued_date} onChange={e=>setForm(f=>({...f,issued_date:e.target.value}))} /></div>
              </div>
              <div className="form-group"><label>Deskripsi</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} /></div>
              <h4 style={{marginBottom:8}}>Part Changes</h4>
              {form.parts.map((p,i)=>(
                <div key={i} style={{background:'#f9fafb',borderRadius:6,padding:12,marginBottom:8}}>
                  <div className="grid-2" style={{gap:8}}>
                    <div className="form-group" style={{marginBottom:8}}><label style={{fontSize:12}}>Part Number *</label><input value={p.part_number} onChange={e=>updPart(i,'part_number',e.target.value)} /></div>
                    <div className="form-group" style={{marginBottom:8}}><label style={{fontSize:12}}>Part Name</label><input value={p.part_name} onChange={e=>updPart(i,'part_name',e.target.value)} /></div>
                  </div>
                  <div className="form-group" style={{marginBottom:4}}><label style={{fontSize:12}}>Deskripsi Perubahan</label><input value={p.change_description} onChange={e=>updPart(i,'change_description',e.target.value)} /></div>
                  {form.parts.length>1&&<button type="button" className="btn btn-danger btn-sm" onClick={()=>removePart(i)}>Hapus</button>}
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addPart} style={{marginBottom:16}}>+ Tambah Part</button>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="card">
        <table>
          <thead><tr><th>Nomor ECN</th><th>Judul</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
          <tbody>
            {items.map(e=>(
              <tr key={e.id}>
                <td style={{fontFamily:'monospace',fontWeight:600}}>{e.ecn_number}</td>
                <td>{e.title}</td>
                <td><span className={`badge ${e.status==='active'?'badge-green':'badge-gray'}`}>{e.status}</span></td>
                <td style={{fontSize:13}}>{e.issued_date?new Date(e.issued_date).toLocaleDateString('id-ID'):'-'}</td>
                <td><button className="btn btn-danger btn-sm" onClick={async()=>{if(!confirm('Hapus ECN ini?'))return;await fetch(`/api/ecn/${e.id}`,{method:'DELETE'});load();}}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length===0&&<p style={{color:'#999',fontSize:14,padding:'12px 0'}}>Belum ada data.</p>}
      </div>
    </>
  );
}