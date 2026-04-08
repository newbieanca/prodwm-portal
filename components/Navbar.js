'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }
  return (
    <nav className="navbar">
      <span className="brand">🏭 ProdWM Portal</span>
      <Link href="/">Dashboard</Link>
      <Link href="/announcements">Pengumuman</Link>
      <Link href="/forms">Form</Link>
      <Link href="/links">Links</Link>
      <Link href="/ecn">ECN</Link>
      <Link href="/schedule">Jadwal</Link>
      <Link href="/qa">Q&A</Link>
      <div className="ml">
        <Link href="/admin">Admin</Link>
      </div>
    </nav>
  );
}