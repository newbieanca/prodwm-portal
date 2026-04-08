'use client';
import { useState, useEffect } from 'react';

export default function AdminAnnouncements() {
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({title:'',content:'',is_pinned:false});
  const [editing,setEditing]=useState(null);
  const [showForm,setShowForm]=useState(false);

  const load=()=>fetch('/api/announcements').then(r=>r.json()).then(setItems);
  useEffect(()=>{load();},[]);

  async function save(e){
    e.preventDefault();
    const method=editing?'PUT':'POST';
    const url=editing?`/api/announcements/${editing}`:'/api/announcements';
    await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setForm({title:'',content:'',is_pinned:false});setEditing(null);setShowForm(false);load();
  }

  return(
    <>
      <div className="page-header"><h1>📢 Pengumuman</h1><button className="btn btn-primary" onClick={()=>{setForm({title:'',content:'',is_pinned:false});setEditing(null);setShowForm(true);}}>+ Tambah</button></div>
      {showForm&&(<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}><div className="modal"><h2>{editing?'Edit':'Tambah'} Pengumuman</h2><form onSubmit={save}><div className="form-group"><label>Judul *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required /></div><div className="form-group"><label>Konten *</label><textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} required /></div><div className="form-group"><label style={{display:'flex',gap:8,alignItems:'center',cursor:'pointer'}}><input type="checkbox" checked={form.is_pinned} onChange={e=>setForm(f=>({...f,is_pinned:e.target.checked}))} style={{width:'auto'}} /> Pin pengumuman</label></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button><button type="submit" className="btn btn-primary">Simpan</button></div></form></div></div>)}
      <div className="card"><table><thead><tr><th>Judul</th><th>Pin</th><th>Tanggal</th><th>Aksi</th></tr></thead><tbody>
        {items.map(a=>(<tr key={a.id}><td><strong>{a.title}</strong></td><td>{a.is_pinned?'📌':'-'}</td><td style={{fontSize:13}}>{new Date(a.created_at).toLocaleDateString('id-ID')}</td><td><button className="btn btn-outline btn-sm" style={{marginRight:4}} onClick={()=>{setForm({title:a.title,content:a.content,is_pinned:a.is_pinned});setEditing(a.id);setShowForm(true);}}>Edit</button><button className="btn btn-danger btn-sm" onClick={async()=>{if(!confirm('Hapus?'))return;await fetch(`/api/announcements/${a.id}`,{method:'DELETE'});load();}}>Hapus</button></td></tr>))}
      </tbody></table></div>
    </>
  );
}