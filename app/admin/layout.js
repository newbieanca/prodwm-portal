import AdminSidebar from '@/components/AdminSidebar';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session.admin) redirect('/login');
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}