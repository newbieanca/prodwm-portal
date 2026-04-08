import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await query('DELETE FROM links WHERE id=$1', [params.id]);
  return NextResponse.json({ success: true });
}