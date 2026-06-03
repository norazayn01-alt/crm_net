// src/types/index.ts
// STRICT RULE APPLIED: ONLY `type` is used, NO `interface`.

export type Client = {
  id: number;
  name: string;
  company_type: string;
  email: string | null;
  phone: string | null;
  created_at: Date;
};

export type Order = {
  id: number;
  client_id: number;
  inventory_id: number;
  item_name?: string; // joined for display
  client_name?: string; // joined for display
  quantity: number;
  total_price: number;
  status: string;
  created_at: Date;
};

export type Inventory = {
  id: number;
  item_name: string;
  sku: string;
  price: number;
  size: string;
  color: string;
  stock_balance: number;
  last_updated: Date;
};

export type Department = {
  id: number;
  name: string;
  head_name: string;
  employee_count: number;
  created_at: string;
};

export type Attendance = {
  id: number;
  employee_name: string;
  date: string;
  status: string; // 'Present', 'Absent', 'Leave'
  created_at: string;
};

export type Currency = {
  id: number;
  code: string; // 'USD', 'UZS'
  symbol: string;
  rate: number;
  last_updated: string;
};

export type Expense = {
  id: number;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  created_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  total_amount: number;
  status: string;
  order_date: string;
  expected_delivery: string;
  created_at: string;
  supplier_name?: string;
}

export interface PurchaseOrderItem {
  id: number;
  po_id: number;
  inventory_id: number;
  quantity: number;
  unit_price: number;
  created_at: string;
};

export type DashboardStats = {
  totalClients: number;
  totalOrders: number;
  totalInventoryBalance: number;
  totalRevenue: number;
  unpaidRevenue: number;
  recentOrders: Order[];
  topProduct: {
    name: string;
    total_sold: number;
  } | null;
};
