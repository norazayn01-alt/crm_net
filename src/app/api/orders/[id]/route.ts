import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request, context: any) {
  try {
    const { params } = context;
    const { id } = await params;

    const db = await getDb();
    
    // Fetch order with client and inventory details joined
    const order = await db.get(`
      SELECT o.*, 
             c.name as client_name, c.company_type, c.email as client_email, c.phone as client_phone,
             i.item_name as item_name, i.sku, i.size, i.color, i.price as item_price
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      JOIN inventory i ON o.inventory_id = i.id
      WHERE o.id = ?
    `, [id]);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
