import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const { rows } = await query(
    'SELECT q.*, adm.name as answered_by_name FROM questions q LEFT JOIN admins adm ON q.answered_by=adm.id ORDER BY created_at DESC'
  );
  return NextResponse.json(rows);
}

export async function POST(req) {
  const { question, asked_by } = await req.json();
  if (!question) return NextResponse.json({ error: 'Question required' }, { status: 400 });
  const { rows } = await query(
    'INSERT INTO questions (question, asked_by) VALUES ($1,$2) RETURNING *',
    [question, asked_by || 'Anonymous']
  );
  return NextResponse.json(rows[0], { status: 201 });
}