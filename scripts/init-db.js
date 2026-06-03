const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function initDb() {
  const dbPath = path.resolve(__dirname, '../crm.db');
  console.log('Initializing database at', dbPath);
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company_type TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS orders;
    CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        inventory_id INTEGER REFERENCES inventory(id) ON DELETE RESTRICT,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'Unpaid',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS inventory;
    CREATE TABLE inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        price REAL NOT NULL,
        size TEXT NOT NULL,
        color TEXT NOT NULL,
        stock_balance INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        head_name TEXT,
        employee_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS attendance;
    CREATE TABLE attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS currencies;
    CREATE TABLE currencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        symbol TEXT NOT NULL,
        rate REAL NOT NULL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS expenses;
    CREATE TABLE expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        description TEXT,
        amount REAL NOT NULL,
        expense_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert dummy inventory data
  const count = await db.get('SELECT COUNT(*) as count FROM inventory');
  if (count.count === 0) {
    await db.exec(`
      INSERT INTO inventory (item_name, sku, price, size, color, stock_balance) VALUES
      ('Classic Cotton T-Shirt', 'TSH-WHT-M', 15.99, 'M', 'White', 500),
      ('Classic Cotton T-Shirt', 'TSH-BLK-L', 15.99, 'L', 'Black', 300),
      ('Denim Jeans', 'JNS-BLU-32', 45.00, '32', 'Blue', 200),
      ('Leather Jacket', 'JCK-BRN-XL', 120.50, 'XL', 'Brown', 50);
    `);
  }

  // Insert dummy HR and Finance data
  await db.exec(`
    INSERT OR IGNORE INTO departments (name, head_name, employee_count) VALUES
    ('IT', 'John Doe', 5),
    ('Sales', 'Jane Smith', 12),
    ('Warehouse', 'Bob Brown', 8);

    INSERT OR IGNORE INTO currencies (code, symbol, rate) VALUES
    ('USD', '$', 1.0),
    ('UZS', 'sum', 12500.0),
    ('EUR', '€', 0.92);

    INSERT OR IGNORE INTO expenses (category, description, amount, expense_date) VALUES
    ('Rent', 'Office Rent', 2500.00, '2023-10-01'),
    ('Salary', 'October Salaries', 15000.00, '2023-10-05');
  `);
  console.log('Inserted dummy ERP data.');

  // Insert dummy clients
  const clientCount = await db.get('SELECT COUNT(*) as count FROM clients');
  if (clientCount.count === 0) {
    await db.exec(`
      INSERT INTO clients (name, company_type, email, phone) VALUES
      ('B2B Demo Shop', 'Dealer', 'b2b@demoshop.com', '+1234567890');
    `);
    console.log('Inserted dummy clients.');
  }

  // Insert dummy users if table is empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    await db.exec(`
      INSERT INTO users (username, password, role, client_id) VALUES
      ('admin', 'admin', 'Admin', NULL),
      ('sales', 'sales', 'Sales', NULL),
      ('warehouse', 'warehouse', 'Warehouse', NULL),
      ('client', 'client', 'B2B', 1);
    `);
    console.log('Inserted dummy users.');
  }

  console.log('Database initialized successfully.');
  await db.close();
}

initDb().catch(console.error);
