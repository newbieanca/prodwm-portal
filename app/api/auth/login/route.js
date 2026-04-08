import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(req) {
  try {
    const { name, npk } = await req.json();
    if (!name || !npk) return NextResponse.json({ error: 'Name and NPK required' }, { status: 400 });
    const { rows } = await query(
      'SELECT * FROM admins WHERE UPPER(name) = UPPER($1) AND npk = $2',
      [name.trim(), npk.trim()]
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Nama atau NPK salah' }, { status: 401 });
    const admin = rows[0];
    const session = await getSession();
    session.admin = { id: admin.id, name: admin.name, npk: admin.npk, role: admin.role };
    await session.save();
    return NextResponse.json({ success: true, admin: session.admin });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}