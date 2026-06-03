import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM departments ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, head_name, employee_count } = await request.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO departments (name, head_name, employee_count) VALUES (?, ?, ?)',
      [name, head_name, employee_count || 0]
    );
    return NextResponse.json({ id: result.lastID, name, head_name, employee_count }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}
