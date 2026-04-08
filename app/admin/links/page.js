'use client';
import { useState, useEffect } from 'react';

export default function AdminLinks() {
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({title:'',url:'',description:'',category_id:''});
  const [showForm,setShowForm]=useState(false);

  const load=()=>fetch('/api/links').then(r=>r.json()).then(setItems);
  useEffect(()=>{load();},[]);

  async function save(e){
    e.preventDefault();
    await fetch('/api/links',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setForm({title:'',url:'',description:'',category_id:''});setShowForm(false);load();
  }

  return(
    <>
      <div className="page-header"><h1>🔗 Important Links</h1><button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Tambah</button></div>
      {showForm&&(<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}><div className="modal"><h2>Tambah Link</h2><form onSubmit={save}><div className="form-group"><label>Judul *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required /></div><div className="form-group"><label>URL *</label><input value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} placeholder="https://..." required /></div><div className="form-group"><label>Deskripsi</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} /></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button><button type="submit" className="btn btn-primary">Simpan</button></div></form></div></div>)}
      <div className="card"><table><thead><tr><th>Judul</th><th>URL</th><th>Aksi</th></tr></thead><tbody>
        {items.map(l=>(<tr key={l.id}><td><strong>{l.title}</strong></td><td><a href={l.url} target="_blank" rel="noreferrer" style={{fontSize:13}}>{l.url.slice(0,50)}</a></td><td><button className="btn btn-danger btn-sm" onClick={async()=>{if(!confirm('Hapus?'))return;await fetch(`/api/links/${l.id}`,{method:'DELETE'});load();}}>Hapus</button></td></tr>))}
      </tbody></table></div>
    </>
  );
}