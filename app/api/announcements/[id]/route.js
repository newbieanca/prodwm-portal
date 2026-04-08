import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function PUT(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, content, is_pinned } = await req.json();
  const { rows } = await query(
    'UPDATE announcements SET title=$1, content=$2, is_pinned=$3 WHERE id=$4 RETURNING *',
    [title, content, is_pinned || false, params.id]
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await query('DELETE FROM announcements WHERE id=$1', [params.id]);
  return NextResponse.json({ success: true });
}