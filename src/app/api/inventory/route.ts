import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM inventory ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { item_name, sku, price, size, color, stock_balance } = await request.json();
    
    if (!item_name || !sku || !price || !size || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO inventory (item_name, sku, price, size, color, stock_balance) VALUES (?, ?, ?, ?, ?, ?)',
      [item_name, sku, price, size, color, stock_balance || 0]
    );

    const newItem = await db.get('SELECT * FROM inventory WHERE id = ?', [result.lastID]);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('DB Error:', error);
    if (error?.code === 'SQLITE_CONSTRAINT') {
      return NextResponse.json({ error: 'SKU must be unique' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
