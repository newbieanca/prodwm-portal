import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { query } from '@/lib/db';

async function getStats() {
  const [ann, frm, lnk, ecn] = await Promise.all([
    query('SELECT COUNT(*) FROM announcements'),
    query('SELECT COUNT(*) FROM forms'),
    query('SELECT COUNT(*) FROM links'),
    query('SELECT COUNT(*) FROM ecn_documents'),
  ]);
  return {
    announcements: ann.rows[0].count,
    forms: frm.rows[0].count,
    links: lnk.rows[0].count,
    ecn: ecn.rows[0].count,
  };
}

async function getLatestAnnouncements() {
  const { rows } = await query(
    'SELECT * FROM announcements ORDER BY is_pinned DESC, created_at DESC LIMIT 5'
  );
  return rows;
}

export default async function HomePage() {
  const stats = await getStats();
  const announcements = await getLatestAnnouncements();
  const menuItems = [
    { label: 'Pengumuman', value: stats.announcements, href: '/announcements', icon: '📢' },
    { label: 'Form', value: stats.forms, href: '/forms', icon: '📋' },
    { label: 'Links', value: stats.links, href: '/links', icon: '🔗' },
    { label: 'ECN Dokumen', value: stats.ecn, href: '/ecn', icon: '📄' },
    { label: 'Jadwal Produksi', value: '-', href: '/schedule', icon: '📅' },
    { label: 'Q&A', value: '-', href: '/qa', icon: '❓' },
  ];
  return (
    <>
      <Navbar />
      <div className="container page">
        <h1 style={{marginBottom:4,fontSize:22}}>Dashboard Produksi WM</h1>
        <p style={{color:'#666',marginBottom:24,fontSize:14}}>PT Sharp Electronics Indonesia — Washing Machine Division</p>
        <div className="grid-3" style={{marginBottom:24}}>
          {menuItems.map(s => (
            <Link key={s.href} href={s.href} style={{textDecoration:'none'}}>
              <div className="stat-card" style={{cursor:'pointer'}}>
                <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                <div className="value">{s.value}</div>
                <div className="label">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="card">
          <h3>📢 Pengumuman Terbaru</h3>
          {announcements.length === 0 && <p style={{color:'#999',fontSize:14,marginTop:8}}>Belum ada pengumuman.</p>}
          {announcements.map(a => (
            <div key={a.id} style={{borderTop:'1px solid #eee',paddingTop:10,marginTop:10}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                {a.is_pinned && <span className="badge badge-blue">📌 Pinned</span>}
                <strong style={{fontSize:14}}>{a.title}</strong>
              </div>
              <p style={{fontSize:13,color:'#555',marginTop:4}}>{a.content.slice(0,120)}{a.content.length>120?'...':''}</p>
              <span style={{fontSize:11,color:'#999'}}>{new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}