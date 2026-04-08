import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function PUT(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { answer } = await req.json();
  const { rows } = await query(
    'UPDATE questions SET answer=$1, answered_by=$2, answered_at=NOW() WHERE id=$3 RETURNING *',
    [answer, session.admin.id, params.id]
  );
  return NextResponse.json(rows[0]);
}