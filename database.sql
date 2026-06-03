-- database.sql
-- BTEC Unit 6 (Cloud Networking) - Wholesale Clothing CRM

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_type VARCHAR(50) NOT NULL, -- e.g., 'Shop', 'Dealer'
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- e.g., 'T-Shirts', 'Jeans', 'Jackets'
    quantity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Processing', 'Shipped', 'Delivered'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    stock_balance INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy inventory data for dashboard
INSERT INTO inventory (item_name, stock_balance) VALUES
('T-Shirts', 1500),
('Jeans', 800),
('Jackets', 300)
ON CONFLICT DO NOTHING;
