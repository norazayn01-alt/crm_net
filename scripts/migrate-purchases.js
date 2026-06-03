const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function migrate() {
  const dbPath = path.join(__dirname, '..', 'crm.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log('Running migration...');
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER REFERENCES suppliers(id) ON DELETE RESTRICT,
      total_amount REAL NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'Pending',
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expected_delivery DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchase_order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      po_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
      inventory_id INTEGER REFERENCES inventory(id) ON DELETE RESTRICT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Inserting dummy suppliers...');
  await db.exec(`
    INSERT OR IGNORE INTO suppliers (name, contact_person, phone, email, address) VALUES
    ('Abu-Sahiy Optom', 'Ilhom aka', '+998901112233', 'optom@abusahiy.uz', 'Toshkent, Abu-Sahiy bozori'),
    ('Xitoy Import MChJ', 'Wong Lee', '+998994445566', 'import@china.uz', 'Toshkent sh, Chilonzor'),
    ('Istiqlol Tekstil', 'Madina', '+998937778899', 'info@istiqlol.uz', 'Andijon viloyati');
  `);

  console.log('Migration completed successfully!');
  await db.close();
}

migrate().catch(console.error);
