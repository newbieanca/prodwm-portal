'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';

export default function ECNPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  async function fetchECN(q = '') {
    setLoading(true);
    const res = await fetch(`/api/ecn${q ? `?search=${encodeURIComponent(q)}` : ''}`);
    setResults(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchECN(); }, []);

  async function loadDetail(id) {
    const res = await fetch(`/api/ecn/${id}`);
    setSelected(await res.json());
  }

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header"><h1>📄 ECN / PKK Viewer</h1></div>
        <div className="card" style={{marginBottom:16}}>
          <div style={{display:'flex',gap:8}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nomor ECN atau part number..." onKeyDown={e=>e.key==='Enter'&&fetchECN(search)} style={{flex:1}} />
            <button className="btn btn-primary" onClick={()=>fetchECN(search)}>Cari</button>
            <button className="btn btn-outline" onClick={()=>{setSearch('');fetchECN('')}}>Reset</button>
          </div>
        </div>
        <div className="grid-2">
          <div className="card" style={{overflow:'auto'}}>
            <h3 style={{marginBottom:12}}>Daftar ECN {loading&&'(loading...)'}</h3>
            {results.length===0&&!loading&&<p style={{color:'#999',fontSize:14}}>Tidak ada data.</p>}
            {results.map(r=>(
              <div key={r.id} onClick={()=>loadDetail(r.ecn_id||r.id)}
                style={{padding:'10px 12px',borderRadius:6,cursor:'pointer',background:selected?.id===(r.ecn_id||r.id)?'#eff6ff':'transparent',borderBottom:'1px solid #eee'}}>
                <div style={{fontWeight:600,fontSize:14}}>{r.ecn_number}</div>
                <div style={{fontSize:13,color:'#555'}}>{r.title}</div>
                {r.part_number&&<div style={{fontSize:12,color:'#1a56db',marginTop:2}}>Part: {r.part_number}</div>}
                <span className={`badge ${r.status==='active'?'badge-green':'badge-gray'}`} style={{marginTop:4}}>{r.status}</span>
              </div>
            ))}
          </div>
          <div className="card">
            {!selected&&<p style={{color:'#999',fontSize:14}}>Pilih ECN untuk melihat detail</p>}
            {selected&&(
              <>
                <h3>{selected.ecn_number} — {selected.title}</h3>
                <p style={{fontSize:13,color:'#555',marginTop:6,marginBottom:12}}>{selected.description}</p>
                <div style={{fontSize:13,marginBottom:12}}>
                  <div><strong>Diterbitkan:</strong> {selected.issued_by}</div>
                  <div><strong>Tanggal:</strong> {selected.issued_date?new Date(selected.issued_date).toLocaleDateString('id-ID'):'-'}</div>
                  <div><strong>Status:</strong> <span className={`badge ${selected.status==='active'?'badge-green':'badge-gray'}`}>{selected.status}</span></div>
                </div>
                <h4 style={{marginBottom:8}}>Part Changes ({selected.parts?.length||0})</h4>
                <table>
                  <thead><tr><th>Part Number</th><th>Part Name</th><th>Perubahan</th></tr></thead>
                  <tbody>
                    {selected.parts?.map(p=>(
                      <tr key={p.id}>
                        <td style={{fontFamily:'monospace'}}>{p.part_number}</td>
                        <td>{p.part_name}</td>
                        <td style={{color:'#666'}}>{p.change_description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}