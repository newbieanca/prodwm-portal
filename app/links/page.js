import Navbar from '@/components/Navbar';
import { query } from '@/lib/db';

export default async function LinksPage() {
  const { rows } = await query(
    'SELECT l.*, c.name as category_name FROM links l LEFT JOIN categories c ON l.category_id=c.id ORDER BY created_at DESC'
  );
  const grouped = rows.reduce((acc,l)=>{ const cat=l.category_name||'Lainnya'; if(!acc[cat])acc[cat]=[]; acc[cat].push(l); return acc; },{});
  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header"><h1>🔗 Important Links</h1></div>
        {Object.entries(grouped).map(([cat,links])=>(
          <div key={cat} className="card" style={{marginBottom:16}}>
            <h3 style={{marginBottom:12}}>{cat}</h3>
            {links.map(l=>(
              <div key={l.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #f0f0f0'}}>
                <span style={{fontSize:20}}>🔗</span>
                <div>
                  <a href={l.url} target="_blank" rel="noreferrer" style={{fontWeight:500}}>{l.title}</a>
                  {l.description&&<div style={{fontSize:12,color:'#777'}}>{l.description}</div>}
                </div>
              </div>
            ))}
          </div>
        ))}
        {rows.length===0&&<div className="card"><p style={{color:'#999'}}>Belum ada link.</p></div>}
      </div>
    </>
  );
}