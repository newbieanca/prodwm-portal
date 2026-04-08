import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export default async function AdminDashboard() {
  const session = await getSession();
  const [ecn,frm,lnk,ann,qtot,qun] = await Promise.all([
    query('SELECT COUNT(*) FROM ecn_documents'),
    query('SELECT COUNT(*) FROM forms'),
    query('SELECT COUNT(*) FROM links'),
    query('SELECT COUNT(*) FROM announcements'),
    query('SELECT COUNT(*) FROM questions'),
    query("SELECT COUNT(*) FROM questions WHERE answer IS NULL"),
  ]);
  const stats = [
    {label:'ECN Dokumen',   value:ecn.rows[0].count,  icon:'📄'},
    {label:'Form',          value:frm.rows[0].count,  icon:'📋'},
    {label:'Links',         value:lnk.rows[0].count,  icon:'🔗'},
    {label:'Pengumuman',    value:ann.rows[0].count,  icon:'📢'},
    {label:'Total Q&A',     value:qtot.rows[0].count, icon:'❓'},
    {label:'Belum Dijawab', value:qun.rows[0].count,  icon:'⏳'},
  ];
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{fontSize:14,color:'#666',marginTop:4}}>Selamat datang, {session.admin?.name}</p>
        </div>
      </div>
      <div className="grid-3">
        {stats.map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}