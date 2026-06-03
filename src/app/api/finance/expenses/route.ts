import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM expenses ORDER BY expense_date DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { category, description, amount, expense_date } = await request.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO expenses (category, description, amount, expense_date) VALUES (?, ?, ?, ?)',
      [category, description, amount, expense_date]
    );
    return NextResponse.json({ id: result.lastID, category, description, amount, expense_date }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
