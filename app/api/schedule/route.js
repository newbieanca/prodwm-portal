import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const { rows } = await query('SELECT * FROM production_schedules ORDER BY year DESC, month DESC');
  return NextResponse.json(rows);
}

export async function POST(req) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, month, year, items } = await req.json();
  if (!title || !month || !year || !items?.length)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  try {
    await query('BEGIN');
    const { rows } = await query(
      'INSERT INTO production_schedules (title, month, year, created_by) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, month, year, session.admin.id]
    );
    for (const item of items) {
      await query(
        'INSERT INTO production_schedule_items (schedule_id, date, planned_output) VALUES ($1,$2,$3)',
        [rows[0].id, item.date, item.planned_output]
      );
    }
    await query('COMMIT');
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    await query('ROLLBACK');
    if (err.code === '23505') return NextResponse.json({ error: 'Jadwal bulan ini sudah ada' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}