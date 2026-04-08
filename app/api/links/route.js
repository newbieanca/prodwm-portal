import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const { rows } = await query(
    'SELECT l.*, c.name as category_name FROM links l LEFT JOIN categories c ON l.category_id=c.id ORDER BY created_at DESC'
  );
  return NextResponse.json(rows);
}

export async function POST(req) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, url, description, category_id } = await req.json();
  if (!title || !url) return NextResponse.json({ error: 'Title and URL required' }, { status: 400 });
  const { rows } = await query(
    'INSERT INTO links (title, url, description, category_id) VALUES ($1,$2,$3,$4) RETURNING *',
    [title, url, description, category_id || null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}