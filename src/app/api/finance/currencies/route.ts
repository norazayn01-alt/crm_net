import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM currencies ORDER BY code ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { code, symbol, rate } = await request.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO currencies (code, symbol, rate) VALUES (?, ?, ?)',
      [code, symbol, rate]
    );
    return NextResponse.json({ id: result.lastID, code, symbol, rate }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
