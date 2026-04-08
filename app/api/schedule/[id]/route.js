import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, { params }) {
  const schedule = await query('SELECT * FROM production_schedules WHERE id=$1', [params.id]);
  if (!schedule.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const items = await query(
    'SELECT * FROM production_schedule_items WHERE schedule_id=$1 ORDER BY date ASC',
    [params.id]
  );
  const planned_total = items.rows.reduce((s, i) => s + (i.planned_output || 0), 0);
  const actual_total  = items.rows.reduce((s, i) => s + (i.actual_output  || 0), 0);
  return NextResponse.json({
    ...schedule.rows[0],
    items: items.rows,
    planned_total,
    actual_total,
    remaining: planned_total - actual_total,
  });
}