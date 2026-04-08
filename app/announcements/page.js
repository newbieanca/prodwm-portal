import Navbar from '@/components/Navbar';
import { query } from '@/lib/db';

export default async function AnnouncementsPage() {
  const { rows } = await query(
    'SELECT a.*, adm.name as author FROM announcements a LEFT JOIN admins adm ON a.created_by=adm.id ORDER BY is_pinned DESC, created_at DESC'
  );
  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header"><h1>📢 Pengumuman</h1></div>
        {rows.length===0&&<div className="card"><p style={{color:'#999'}}>Belum ada pengumuman.</p></div>}
        {rows.map(a=>(
          <div className="card" key={a.id}>
            <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
              {a.is_pinned&&<span className="badge badge-blue">📌 Pinned</span>}
              <h3 style={{margin:0}}>{a.title}</h3>
            </div>
            <p style={{fontSize:14,color:'#444',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{a.content}</p>
            <div style={{marginTop:10,fontSize:12,color:'#999'}}>{a.author||'Admin'} — {new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</div>
          </div>
        ))}
      </div>
    </>
  );
}