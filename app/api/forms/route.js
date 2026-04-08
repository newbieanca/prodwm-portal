import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const { rows } = await query(
    'SELECT f.*, c.name as category_name FROM forms f LEFT JOIN categories c ON f.category_id=c.id ORDER BY created_at DESC'
  );
  return NextResponse.json(rows);
}

export async function POST(req) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, description, file_key, external_url, category_id } = await req.json();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
  const { rows } = await query(
    'INSERT INTO forms (title, description, file_key, external_url, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [title, description, file_key, external_url, category_id || null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}