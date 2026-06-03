import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT po.*, s.name as supplier_name 
      FROM purchase_orders po
      JOIN suppliers s ON po.supplier_id = s.id
      ORDER BY po.id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { supplier_id, total_amount, expected_delivery, items } = body;
    
    if (!supplier_id || !items || items.length === 0) {
      return NextResponse.json({ error: 'Supplier and items are required' }, { status: 400 });
    }

    // Start transaction manually since better-sqlite3 wrapper might not expose it easily
    await db.exec('BEGIN TRANSACTION');

    try {
      const poResult = await db.run(
        'INSERT INTO purchase_orders (supplier_id, total_amount, expected_delivery) VALUES (?, ?, ?)',
        [supplier_id, total_amount, expected_delivery]
      );
      
      const poId = poResult.lastID;

      for (const item of items) {
        await db.run(
          'INSERT INTO purchase_order_items (po_id, inventory_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [poId, item.inventory_id, item.quantity, item.unit_price]
        );
      }

      await db.exec('COMMIT');
      return NextResponse.json({ id: poId }, { status: 201 });
    } catch (e) {
      await db.exec('ROLLBACK');
      throw e;
    }
  } catch (error) {
    console.error('Failed to create purchase order:', error);
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
  }
}
