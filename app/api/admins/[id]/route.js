import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session.admin || session.admin.role !== 'superadmin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await query('DELETE FROM admins WHERE id = $1', [params.id]);
  return NextResponse.json({ success: true });
}