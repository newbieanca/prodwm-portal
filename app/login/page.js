'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ name:'', npk:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f6fa'}}>
      <div style={{background:'white',padding:32,borderRadius:10,width:360,boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
        <h1 style={{marginBottom:8,fontSize:22}}>🏭 ProdWM Portal</h1>
        <p style={{color:'#666',marginBottom:24,fontSize:14}}>Login Admin</p>
        {error&&<div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="RIZKI FIRMANSYAH" required />
          </div>
          <div className="form-group">
            <label>NPK</label>
            <input value={form.npk} onChange={e=>setForm(f=>({...f,npk:e.target.value}))} placeholder="1400548" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%'}} disabled={loading}>{loading?'Loading...':'Login'}</button>
        </form>
      </div>
    </div>
  );
}