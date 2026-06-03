import { Users, ShoppingBag, DollarSign, TrendingUp, MoreHorizontal } from 'lucide-react';
import { getDb } from '@/lib/db';
import type { DashboardStats, Order } from '@/types';
import Link from 'next/link';
import { RevenueChart, ProductsChart, OrderStatusChart } from '@/components/DashboardCharts';
import { DashboardControls } from '@/components/DashboardControls';
import { getServerTranslations } from '@/i18n/server';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const db = await getDb();
  
  const clientsRes = await db.get('SELECT COUNT(*) as count FROM clients');
  const ordersRes = await db.get('SELECT COUNT(*) as count FROM orders');
  const inventoryRes = await db.get('SELECT SUM(stock_balance) as sum FROM inventory');
  
  const revenueRes = await db.get('SELECT SUM(total_price) as sum FROM orders WHERE status = "Paid"');
  const unpaidRes = await db.get('SELECT SUM(total_price) as sum FROM orders WHERE status = "Unpaid"');

  // Chart Data: Revenue Trend (Mocking past 7 days based on data)
  // If no data, we will return some fallback dummy data for demonstration
  const rawRevenue = await db.all(`
    SELECT date(created_at) as day, SUM(total_price) as revenue 
    FROM orders 
    GROUP BY date(created_at) 
    ORDER BY day ASC LIMIT 7
  `);
  
  let revenueTrend = rawRevenue.map(r => ({ name: r.day, revenue: r.revenue }));
  if (revenueTrend.length === 0) {
    revenueTrend = [
      { name: 'Mon', revenue: 1200 },
      { name: 'Tue', revenue: 1900 },
      { name: 'Wed', revenue: 1500 },
      { name: 'Thu', revenue: 2200 },
      { name: 'Fri', revenue: 2800 },
      { name: 'Sat', revenue: 3100 },
      { name: 'Sun', revenue: 2400 },
    ];
  }

  // Chart Data: Top Products
  const rawProducts = await db.all(`
    SELECT i.item_name as name, SUM(o.quantity) as value
    FROM orders o
    JOIN inventory i ON o.inventory_id = i.id
    GROUP BY o.inventory_id
    ORDER BY value DESC
    LIMIT 5
  `);
  let topProducts = rawProducts;
  if (topProducts.length === 0) {
    topProducts = [
      { name: 'Classic T-Shirt', value: 400 },
      { name: 'Denim Jeans', value: 300 },
      { name: 'Leather Jacket', value: 150 },
      { name: 'Sneakers', value: 100 },
    ];
  }

  // Chart Data: Order Status
  const rawStatuses = await db.all(`
    SELECT status as name, COUNT(*) as value
    FROM orders
    GROUP BY status
  `);
  let orderStatuses = rawStatuses;
  if (orderStatuses.length === 0) {
    orderStatuses = [
      { name: 'Paid', value: 65 },
      { name: 'Unpaid', value: 20 },
      { name: 'Partial', value: 15 },
    ];
  }

  const recentOrdersRes = await db.all(`
    SELECT o.*, c.name as client_name, i.item_name as item_name 
    FROM orders o
    JOIN clients c ON o.client_id = c.id
    JOIN inventory i ON o.inventory_id = i.id
    ORDER BY o.id DESC
    LIMIT 5
  `);
  
  return {
    totalClients: clientsRes?.count || 0,
    totalOrders: ordersRes?.count || 0,
    totalInventoryBalance: inventoryRes?.sum || 0,
    totalRevenue: revenueRes?.sum || 0,
    unpaidRevenue: unpaidRes?.sum || 0,
    revenueTrend,
    topProducts,
    orderStatuses,
    recentOrders: recentOrdersRes as Order[],
  };
}

export default async function Dashboard() {
  const stats = await getDashboardData();
  const { t } = await getServerTranslations();

  return (
    <div className="bg-slate-50 min-h-full -m-4 p-4 md:-m-8 md:p-8 space-y-6">
      
      {/* Power BI Style Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t('dashboard')}</h1>
          <p className="text-sm text-slate-500">Real-time business performance metrics.</p>
        </div>
        
        <DashboardControls />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 truncate max-w-[150px]" title={`$${stats.totalRevenue.toLocaleString()}`}>
                ${stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center relative z-10">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-emerald-600 font-semibold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded mr-2">
              <TrendingUp size={14} className="mr-1" /> +12.5%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Unpaid Invoices</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 truncate max-w-[150px]" title={`$${stats.unpaidRevenue.toLocaleString()}`}>
                ${stats.unpaidRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex-shrink-0 flex items-center justify-center relative z-10">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-600 font-semibold flex items-center bg-red-50 px-1.5 py-0.5 rounded mr-2">
              <TrendingUp size={14} className="mr-1" /> +2.4%
            </span>
            <span className="text-slate-400">Needs attention</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 truncate max-w-[150px]">{stats.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0 flex items-center justify-center relative z-10">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-emerald-600 font-semibold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded mr-2">
              <TrendingUp size={14} className="mr-1" /> +8.1%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Clients</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 truncate max-w-[150px]">{stats.totalClients.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex-shrink-0 flex items-center justify-center relative z-10">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-emerald-600 font-semibold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded mr-2">
              <TrendingUp size={14} className="mr-1" /> +4.3%
            </span>
            <span className="text-slate-400">New signups</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800">Revenue Trend (Last 7 Days)</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
          </div>
          <div className="p-6">
            <RevenueChart data={stats.revenueTrend} />
          </div>
        </div>

        {/* Order Status (Spans 1 column) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800">Order Status</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <OrderStatusChart data={stats.orderStatuses} />
            <div className="w-full mt-4 flex justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-3 h-3 rounded-full bg-emerald-500"></span>Paid</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-3 h-3 rounded-full bg-red-500"></span>Unpaid</div>
            </div>
          </div>
        </div>

        {/* Top Products (Spans 1 column) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800">Top Products by Volume</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
          </div>
          <div className="p-6">
            <ProductsChart data={stats.topProducts} />
          </div>
        </div>

        {/* Recent Orders Table (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800">Recent Transactions</h2>
            <Link href="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-6 font-semibold text-xs text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="py-3 px-6 font-semibold text-xs text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="py-3 px-6 font-semibold text-xs text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-sm font-medium text-slate-900">#{order.id}</td>
                    <td className="py-3 px-6 text-sm text-slate-600">{order.client_name}</td>
                    <td className="py-3 px-6 text-sm font-semibold text-slate-900">${order.total_price?.toFixed(2)}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${order.status === 'Unpaid' ? 'bg-red-50 text-red-600' : ''}
                        ${order.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : ''}
                        ${order.status === 'Partial' ? 'bg-amber-50 text-amber-600' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">No recent transactions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
