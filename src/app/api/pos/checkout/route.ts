import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { cart } = await request.json(); // cart is Array<{ inventory_id, quantity }>
    
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const db = await getDb();
    
    // Find or create Walk-in Customer
    let walkInClient = await db.get("SELECT id FROM clients WHERE name = 'Walk-in Customer'");
    if (!walkInClient) {
      const result = await db.run(
        "INSERT INTO clients (name, company_type, email, phone) VALUES (?, ?, ?, ?)",
        ['Walk-in Customer', 'Shop', 'walkin@example.com', 'N/A']
      );
      walkInClient = { id: result.lastID };
    }

    const clientId = walkInClient.id;

    // Process all items in cart
    for (const item of cart) {
      const inventoryItem = await db.get('SELECT price, stock_balance FROM inventory WHERE id = ?', [item.inventory_id]);
      if (!inventoryItem) continue; // Skip invalid items

      const qty = Number(item.quantity);
      if (qty <= 0 || inventoryItem.stock_balance < qty) continue; // Skip if not enough stock

      const total_price = inventoryItem.price * qty;

      await db.run(
        'INSERT INTO orders (client_id, inventory_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
        [clientId, item.inventory_id, qty, total_price, 'Paid']
      );

      await db.run('UPDATE inventory SET stock_balance = stock_balance - ? WHERE id = ?', [qty, item.inventory_id]);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
