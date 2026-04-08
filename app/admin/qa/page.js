'use client';
import { useState, useEffect } from 'react';

export default function AdminQA() {
  const [items,setItems]=useState([]);
  const [answering,setAnswering]=useState(null);
  const [answer,setAnswer]=useState('');

  const load=()=>fetch('/api/qa').then(r=>r.json()).then(setItems);
  useEffect(()=>{load();},[]);

  async function saveAnswer(id){
    await fetch(`/api/qa/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({answer})});
    setAnswering(null);setAnswer('');load();
  }

  return(
    <>
      <div className="page-header"><h1>❓ Q&A</h1></div>
      <div className="card">
        {items.map(q=>(<div key={q.id} style={{borderBottom:'1px solid #eee',padding:'14px 0'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div style={{flex:1}}>
              <p style={{fontWeight:500,marginBottom:4}}>{q.question}</p>
              <div style={{fontSize:12,color:'#999',marginBottom:8}}>{q.asked_by} — {new Date(q.created_at).toLocaleDateString('id-ID')}</div>
              {q.answer&&<div style={{background:'#f0fdf4',borderRadius:6,padding:'8px 12px',fontSize:14}}><strong style={{fontSize:12,color:'#059669'}}>Jawaban:</strong> {q.answer}</div>}
              {answering===q.id&&<div style={{marginTop:8}}><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Tulis jawaban..." style={{marginBottom:8}} /><div style={{display:'flex',gap:8}}><button className="btn btn-primary btn-sm" onClick={()=>saveAnswer(q.id)}>Simpan</button><button className="btn btn-outline btn-sm" onClick={()=>setAnswering(null)}>Batal</button></div></div>}
            </div>
            <div style={{marginLeft:12}}>
              {!q.answer&&answering!==q.id&&<button className="btn btn-primary btn-sm" onClick={()=>{setAnswering(q.id);setAnswer('');}}>Jawab</button>}
              {q.answer&&answering!==q.id&&<button className="btn btn-outline btn-sm" onClick={()=>{setAnswering(q.id);setAnswer(q.answer);}}>Edit</button>}
            </div>
          </div>
        </div>))}
        {items.length===0&&<p style={{color:'#999',fontSize:14}}>Belum ada pertanyaan.</p>}
      </div>
    </>
  );
}