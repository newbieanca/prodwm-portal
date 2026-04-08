'use client';
import { useState, useEffect } from 'react';

export default function AdminAdmins() {
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({name:'',npk:'',role:'admin'});
  const [showForm,setShowForm]=useState(false);
  const [error,setError]=useState('');

  const load=()=>fetch('/api/admins').then(r=>r.json()).then(setItems);
  useEffect(()=>{load();},[]);

  async function save(e){
    e.preventDefault();setError('');
    const res=await fetch('/api/admins',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    if(!res.ok){setError((await res.json()).error);return;}
    setForm({name:'',npk:'',role:'admin'});setShowForm(false);load();
  }

  return(
    <>
      <div className="page-header"><h1>👤 Manage Admin</h1><button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Tambah Admin</button></div>
      {showForm&&(<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}><div className="modal"><h2>Tambah Admin</h2>{error&&<div className="alert alert-error">{error}</div>}<form onSubmit={save}><div className="form-group"><label>Nama Lengkap *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="NAMA LENGKAP" required /></div><div className="form-group"><label>NPK *</label><input value={form.npk} onChange={e=>setForm(f=>({...f,npk:e.target.value}))} required /></div><div className="form-group"><label>Role</label><select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}><option value="admin">Admin</option><option value="superadmin">Superadmin</option></select></div><div className="modal-footer"><button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button><button type="submit" className="btn btn-primary">Simpan</button></div></form></div></div>)}
      <div className="card"><table><thead><tr><th>Nama</th><th>NPK</th><th>Role</th><th>Aksi</th></tr></thead><tbody>
        {items.map(a=>(<tr key={a.id}><td><strong>{a.name}</strong></td><td style={{fontFamily:'monospace'}}>{a.npk}</td><td><span className={`badge ${a.role==='superadmin'?'badge-blue':'badge-gray'}`}>{a.role}</span></td><td>{a.role!=='superadmin'&&<button className="btn btn-danger btn-sm" onClick={async()=>{if(!confirm('Hapus admin ini?'))return;await fetch(`/api/admins/${a.id}`,{method:'DELETE'});load();}}>Hapus</button>}</td></tr>))}
      </tbody></table></div>
    </>
  );
}