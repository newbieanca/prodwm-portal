import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const { rows } = await query('SELECT id, name, npk, role, created_at FROM admins ORDER BY created_at DESC');
  return NextResponse.json(rows);
}

export async function POST(req) {
  const session = await getSession();
  if (!session.admin || session.admin.role !== 'superadmin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { name, npk, role } = await req.json();
  if (!name || !npk) return NextResponse.json({ error: 'Name and NPK required' }, { status: 400 });
  try {
    const { rows } = await query(
      'INSERT INTO admins (name, npk, role) VALUES ($1, $2, $3) RETURNING *',
      [name.trim().toUpperCase(), npk.trim(), role || 'admin']
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    if (err.code === '23505') return NextResponse.json({ error: 'NPK sudah terdaftar' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}