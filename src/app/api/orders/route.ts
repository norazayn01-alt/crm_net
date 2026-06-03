import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT o.*, c.name as client_name, i.item_name as item_name 
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      JOIN inventory i ON o.inventory_id = i.id
      ORDER BY o.id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { client_id, inventory_id, quantity } = await request.json();
    
    if (!client_id || !inventory_id || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      return NextResponse.json({ error: 'Quantity must be greater than 0' }, { status: 400 });
    }

    const db = await getDb();
    
    const item = await db.get('SELECT price, stock_balance FROM inventory WHERE id = ?', [inventory_id]);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (item.stock_balance < qty) {
      return NextResponse.json({ error: `Not enough stock. Only ${item.stock_balance} units available.` }, { status: 400 });
    }

    const total_price = item.price * qty;

    const result = await db.run(
      'INSERT INTO orders (client_id, inventory_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [client_id, inventory_id, qty, total_price, 'Unpaid']
    );

    await db.run('UPDATE inventory SET stock_balance = stock_balance - ? WHERE id = ?', [qty, inventory_id]);

    const newOrder = await db.get(`
      SELECT o.*, c.name as client_name, i.item_name as item_name 
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      JOIN inventory i ON o.inventory_id = i.id
      WHERE o.id = ?
    `, [result.lastID]);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
