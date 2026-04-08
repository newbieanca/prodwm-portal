import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req, { params }) {
  const ecn = await query('SELECT * FROM ecn_documents WHERE id=$1', [params.id]);
  const parts = await query('SELECT * FROM part_changes WHERE ecn_id=$1', [params.id]);
  if (!ecn.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...ecn.rows[0], parts: parts.rows });
}

export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await query('DELETE FROM ecn_documents WHERE id=$1', [params.id]);
  return NextResponse.json({ success: true });
}