import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function PUT(req, { params }) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { date, actual_output } = await req.json();
  if (!date || actual_output === undefined)
    return NextResponse.json({ error: 'date and actual_output required' }, { status: 400 });
  const { rows } = await query(
    'UPDATE production_schedule_items SET actual_output=$1, updated_at=NOW() WHERE schedule_id=$2 AND date=$3 RETURNING *',
    [actual_output, params.id, date]
  );
  if (!rows[0]) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}