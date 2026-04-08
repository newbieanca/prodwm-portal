'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href:'/admin',          label:'📊 Dashboard' },
  { href:'/admin/announcements', label:'📢 Pengumuman' },
  { href:'/admin/forms',    label:'📋 Form' },
  { href:'/admin/links',    label:'🔗 Links' },
  { href:'/admin/ecn',      label:'📄 ECN' },
  { href:'/admin/schedule', label:'📅 Jadwal Produksi' },
  { href:'/admin/qa',       label:'❓ Q&A' },
  { href:'/admin/admins',   label:'👤 Admin' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout',{ method:'POST' });
    router.push('/login');
    router.refresh();
  }
  return (
    <div className="sidebar">
      <div className="logo">🏭 ProdWM Admin</div>
      {links.map(l=>(
        <Link key={l.href} href={l.href} className={pathname===l.href?'active':''}>{l.label}</Link>
      ))}
      <button onClick={logout} style={{marginTop:24,background:'rgba(255,255,255,0.15)',color:'white',width:'100%',border:'none',padding:'8px 12px',borderRadius:6,cursor:'pointer',fontSize:14}}>Logout</button>
    </div>
  );
}