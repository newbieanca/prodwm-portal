import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  let rows;
  if (search) {
    const result = await query(
      `SELECT DISTINCT e.*, pc.part_number, pc.part_name
       FROM ecn_documents e
       JOIN part_changes pc ON pc.ecn_id = e.id
       WHERE pc.part_number ILIKE $1 OR e.ecn_number ILIKE $1
       ORDER BY e.created_at DESC`,
      [`%${search}%`]
    );
    rows = result.rows;
  } else {
    const result = await query('SELECT * FROM ecn_documents ORDER BY created_at DESC LIMIT 50');
    rows = result.rows;
  }
  return NextResponse.json(rows);
}

export async function POST(req) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { ecn_number, title, description, file_key, issued_by, issued_date, status, parts } = await req.json();
  if (!ecn_number || !title) return NextResponse.json({ error: 'ECN number and title required' }, { status: 400 });
  try {
    await query('BEGIN');
    const { rows } = await query(
      'INSERT INTO ecn_documents (ecn_number,title,description,file_key,issued_by,issued_date,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [ecn_number, title, description, file_key, issued_by, issued_date || null, status || 'active']
    );
    const ecn = rows[0];
    if (parts && parts.length > 0) {
      for (const p of parts) {
        await query(
          'INSERT INTO part_changes (ecn_id, part_number, part_name, change_description) VALUES ($1,$2,$3,$4)',
          [ecn.id, p.part_number, p.part_name, p.change_description]
        );
      }
    }
    await query('COMMIT');
    return NextResponse.json(ecn, { status: 201 });
  } catch (err) {
    await query('ROLLBACK');
    if (err.code === '23505') return NextResponse.json({ error: 'ECN number atau part number duplikat' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}