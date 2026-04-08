import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const { rows } = await query(
    'SELECT a.*, adm.name as author FROM announcements a LEFT JOIN admins adm ON a.created_by=adm.id ORDER BY is_pinned DESC, created_at DESC'
  );
  return NextResponse.json(rows);
}

export async function POST(req) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, content, is_pinned } = await req.json();
  if (!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
  const { rows } = await query(
    'INSERT INTO announcements (title, content, is_pinned, created_by) VALUES ($1,$2,$3,$4) RETURNING *',
    [title, content, is_pinned || false, session.admin.id]
  );
  return NextResponse.json(rows[0], { status: 201 });
}