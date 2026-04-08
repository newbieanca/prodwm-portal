import Navbar from '@/components/Navbar';
import { query } from '@/lib/db';

export default async function FormsPage() {
  const { rows } = await query(
    'SELECT f.*, c.name as category_name FROM forms f LEFT JOIN categories c ON f.category_id=c.id ORDER BY created_at DESC'
  );
  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header"><h1>📋 Form & Dokumen</h1></div>
        <div className="grid-2">
          {rows.map(f=>(
            <div className="card" key={f.id}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <h3>{f.title}</h3>
                {f.category_name&&<span className="badge badge-blue">{f.category_name}</span>}
              </div>
              {f.description&&<p style={{fontSize:13,color:'#555',marginTop:6}}>{f.description}</p>}
              <div style={{marginTop:12}}>
                {f.external_url&&<a href={f.external_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">🔗 Buka Form</a>}
              </div>
            </div>
          ))}
        </div>
        {rows.length===0&&<div className="card"><p style={{color:'#999'}}>Belum ada form.</p></div>}
      </div>
    </>
  );
}