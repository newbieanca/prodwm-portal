import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function PUT(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, description, file_key, external_url, category_id } = await req.json();
  const { rows } = await query(
    'UPDATE forms SET title=$1,description=$2,file_key=$3,external_url=$4,category_id=$5,updated_at=NOW() WHERE id=$6 RETURNING *',
    [title, description, file_key, external_url, category_id || null, params.id]
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await query('DELETE FROM forms WHERE id=$1', [params.id]);
  return NextResponse.json({ success: true });
}