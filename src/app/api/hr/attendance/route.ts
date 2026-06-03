import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM attendance ORDER BY date DESC LIMIT 100');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { employee_name, date, status } = await request.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO attendance (employee_name, date, status) VALUES (?, ?, ?)',
      [employee_name, date, status]
    );
    return NextResponse.json({ id: result.lastID, employee_name, date, status }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}
