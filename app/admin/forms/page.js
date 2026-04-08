'use client';
import { useState, useEffect } from 'react';

export default function AdminForms() {
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({title:'',description:'',external_url:'',file_key:'',category_id:''});
  const [editing,setEditing]=useState(null);
  const [showForm,setShowForm]=useState(false);

  const load=()=>fetch('/api/forms').then(r=>r.json()).then(setItems);
  useEffect(()=>{load();},[]);

  async function save(e){
    e.preventDefault();
    const method=editing?'PUT':'POST';
    const url=editing?`/api/forms/${editing}`:'/api/forms';
    await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setForm({title:'',description:'',external_url:'',file_key:'',category_id:''});setEditing(null);setShowForm(false);load();
  }

  return(
    <>
      <div className="page-header"><h1>📋 Form & Dokumen</h1><button className="btn btn-primary" onClick={()=>{setForm({title:'',description:'',external_url:'',file_key:'',category_id:''});setEditing(null);setShowForm(true);}}>+ Tambah</button></div>
      {showForm&&(<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}><div className="modal"><h2>{editing?'Edit':'Tambah'} Form</h2><form onSubmit={save}><div className="form-group"><label>Judul *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required /></div><div className="form-group"><label>Deskripsi</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} /></div><div className="form-group"><label>URL Eksternal (Google Drive dll)</label><input value={form.external_url} onChange={e=>setForm(f=>({...f,external_url:e.target.value}))} placeholder="https://..." /></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button><button type="submit" className="btn btn-primary">Simpan</button></div></form></div></div>)}
      <div className="card"><table><thead><tr><th>Judul</th><th>URL</th><th>Aksi</th></tr></thead><tbody>
        {items.map(f=>(<tr key={f.id}><td><strong>{f.title}</strong><br/><span style={{fontSize:12,color:'#666'}}>{f.description}</span></td><td style={{fontSize:12}}>{f.external_url&&<a href={f.external_url} target="_blank" rel="noreferrer">🔗 Buka</a>}</td><td><button className="btn btn-outline btn-sm" style={{marginRight:4}} onClick={()=>{setForm({title:f.title,description:f.description,external_url:f.external_url,file_key:f.file_key,category_id:f.category_id});setEditing(f.id);setShowForm(true);}}>Edit</button><button className="btn btn-danger btn-sm" onClick={async()=>{if(!confirm('Hapus?'))return;await fetch(`/api/forms/${f.id}`,{method:'DELETE'});load();}}>Hapus</button></td></tr>))}
      </tbody></table></div>
    </>
  );
}