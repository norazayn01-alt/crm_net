const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function seedData() {
  const dbPath = path.join(__dirname, '..', 'crm.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log('Clearing old dummy data...');
  await db.exec(`
    DELETE FROM orders;
    DELETE FROM clients;
    DELETE FROM inventory;
    DELETE FROM departments;
    DELETE FROM attendance;
    DELETE FROM expenses;
    DELETE FROM currencies;
  `);

  console.log('Inserting Uzbek Clients...');
  await db.exec(`
    INSERT INTO clients (name, email, phone, company_type) VALUES
    ('Azizbek Rahimov (Korzinka)', 'aziz@korzinka.uz', '+998901234567', 'Retail'),
    ('Malika Karimova (Makro)', 'malika@makro.uz', '+998931112233', 'Retail'),
    ('Sardor Tursunov (Artel)', 'sardor@artel.uz', '+998971239876', 'Dealer'),
    ('Dilnoza Aliyeva (Akfa)', 'dilnoza@akfa.uz', '+998991234567', 'Wholesale'),
    ('Jamshid Bekov (Havas)', 'jamshid@havas.uz', '+998941235555', 'Retail');
  `);
  const clients = await db.all('SELECT id FROM clients');

  console.log('Inserting Uzbek Inventory...');
  await db.exec(`
    INSERT INTO inventory (item_name, sku, price, size, color, stock_balance) VALUES
    ('Erkaklar ko''ylagi', 'SHIRT-M-WHT', 150000, 'M', 'Oq', 120),
    ('Ayollar krossovkasi', 'SNEAK-38-PNK', 350000, '38', 'Pushti', 85),
    ('Qishki kurtka', 'JCKT-L-BLK', 550000, 'L', 'Qora', 45),
    ('Jinsi shim', 'JEANS-32-BLU', 250000, '32', 'Ko''k', 150),
    ('Bolalar kiyimi', 'KIDS-S-YEL', 120000, 'S', 'Sariq', 200),
    ('Qalin sviter', 'SWET-M-GRY', 180000, 'M', 'Kulrang', 90);
  `);
  const items = await db.all('SELECT id, price FROM inventory');

  console.log('Generating Random Orders for Dashboard...');
  const statuses = ['Paid', 'Paid', 'Paid', 'Unpaid', 'Partial'];
  
  for (let i = 0; i < 40; i++) {
    const randomClient = clients[Math.floor(Math.random() * clients.length)].id;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const totalPrice = quantity * randomItem.price;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Spread orders over the last 10 days
    const daysAgo = Math.floor(Math.random() * 10);
    const dateStr = `datetime('now', '-${daysAgo} days')`;

    await db.run(`
      INSERT INTO orders (client_id, inventory_id, quantity, total_price, status, created_at)
      VALUES (?, ?, ?, ?, ?, ${dateStr})
    `, [randomClient, randomItem.id, quantity, totalPrice, status]);
  }

  console.log('Inserting HR Data...');
  await db.exec(`
    INSERT INTO departments (name, head_name, employee_count) VALUES
    ('Sotuv bo''limi', 'Alisher Usmonov', 15),
    ('Moliya', 'Sevara Nazarova', 4),
    ('Omborxona', 'Botir Qodirov', 8),
    ('IT va Dasturlash', 'Jahongir Tojiyev', 6),
    ('Kadrlar (HR)', 'Nodira Vohidova', 3);

    INSERT INTO attendance (employee_name, date, status) VALUES
    ('Alisher Usmonov', date('now'), 'Present'),
    ('Sevara Nazarova', date('now'), 'Present'),
    ('Botir Qodirov', date('now'), 'Absent'),
    ('Jahongir Tojiyev', date('now'), 'Leave'),
    ('Nodira Vohidova', date('now', '-1 day'), 'Present');
  `);

  console.log('Inserting Finance Data...');
  await db.exec(`
    INSERT INTO currencies (code, symbol, rate) VALUES
    ('USD', '$', 12650.0),
    ('EUR', '€', 13500.0),
    ('RUB', '₽', 138.5),
    ('UZS', 'so''m', 1.0);

    INSERT INTO expenses (category, description, amount, expense_date) VALUES
    ('Ijara (Arenda)', 'Toshkent city ofis ijarasi', 25000000, date('now', '-5 days')),
    ('Oylik maoshlar', 'Noyabr oyi uchun xodimlar maoshi', 145000000, date('now', '-2 days')),
    ('Kantselyariya', 'Ofis qog''oz va ruchkalari', 1200000, date('now', '-1 day')),
    ('Soliqlar', 'QQS va ijtimoiy soliqlar', 32000000, date('now'));
  `);

  console.log('Successfully seeded database with Uzbek data!');
}

seedData().catch(console.error);
