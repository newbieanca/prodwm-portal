'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';

export default function QAPage() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question: '', asked_by: '' });
  const [success, setSuccess] = useState(false);

  const load = () => fetch('/api/qa').then(r=>r.json()).then(setQuestions);
  useEffect(()=>{ load(); },[]);

  async function submit(e) {
    e.preventDefault();
    await fetch('/api/qa',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setForm({ question:'', asked_by:'' });
    setSuccess(true);
    setTimeout(()=>setSuccess(false),3000);
    load();
  }

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header"><h1>❓ Q&A</h1></div>
        <div className="card" style={{marginBottom:24}}>
          <h3 style={{marginBottom:12}}>Ajukan Pertanyaan</h3>
          {success&&<div className="alert alert-success">Pertanyaan terkirim! Admin akan segera menjawab.</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Nama (opsional)</label>
              <input value={form.asked_by} onChange={e=>setForm(f=>({...f,asked_by:e.target.value}))} placeholder="Nama Anda" />
            </div>
            <div className="form-group">
              <label>Pertanyaan *</label>
              <textarea value={form.question} onChange={e=>setForm(f=>({...f,question:e.target.value}))} placeholder="Tulis pertanyaan Anda..." required />
            </div>
            <button type="submit" className="btn btn-primary">Kirim Pertanyaan</button>
          </form>
        </div>
        {questions.map(q=>(
          <div className="card" key={q.id} style={{marginBottom:12}}>
            <p style={{fontWeight:500,marginBottom:4}}>{q.question}</p>
            <div style={{fontSize:12,color:'#999',marginBottom:8}}>{q.asked_by} — {new Date(q.created_at).toLocaleDateString('id-ID')}</div>
            {q.answer?(<div style={{background:'#f0fdf4',borderRadius:6,padding:'8px 12px',fontSize:14}}><strong style={{fontSize:12,color:'#059669'}}>✅ Jawaban:</strong> {q.answer}</div>):(<span className="badge badge-gray">Menunggu jawaban</span>)}
          </div>
        ))}
      </div>
    </>
  );
}