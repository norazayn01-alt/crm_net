import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM clients ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, company_type, email, phone } = await request.json();
    
    if (!name || !company_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO clients (name, company_type, email, phone) VALUES (?, ?, ?, ?)',
      [name, company_type, email, phone]
    );

    const newClient = await db.get('SELECT * FROM clients WHERE id = ?', [result.lastID]);

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
