"use client";

import { useState, useEffect } from "react";
import type { Order, Inventory } from "@/types";
import { Package, DollarSign, Printer, ShoppingCart } from "lucide-react";

export default function B2BPortal() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [catalog, setCatalog] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("1");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, catalogRes] = await Promise.all([
        fetch("/api/b2b/orders"),
        fetch("/api/inventory")
      ]);
      
      if (!ordersRes.ok || !catalogRes.ok) throw new Error("Failed to fetch data");
      
      const ordersData = await ordersRes.json();
      const catalogData = await catalogRes.json();
      
      setOrders(ordersData);
      setCatalog(catalogData);
    } catch (err) {
      console.error(err);
      setError("Failed to load portal data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return alert("Please select an item to order");
    
    try {
      const res = await fetch("/api/b2b/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventory_id: selectedItem,
          quantity: Number(quantity)
        })
      });
      
      if (res.ok) {
        setSelectedItem("");
        setQuantity("1");
        fetchData();
        alert("Order placed successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  const totalOrdered = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalUnpaid = orders.filter(o => o.status === 'Unpaid').reduce((sum, o) => sum + (o.total_price || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">B2B Client Portal</h1>
        <p className="text-slate-500 mt-1">Welcome back. Manage your orders and browse our catalog.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 ">Total Ordered</p>
            <p className="text-2xl font-bold text-slate-900 ">${totalOrdered.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 ">Total Unpaid (Debt)</p>
            <p className="text-2xl font-bold text-slate-900 ">${totalUnpaid.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg text-white h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><ShoppingCart size={20} /> Place New Order</h2>
          <form onSubmit={handleOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1">Select Product</label>
              <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} required
                className="w-full px-4 py-2 rounded-lg bg-white border border-white/20 text-white focus:ring-2 focus:ring-white outline-none">
                <option value="" className="text-slate-900">-- Choose Item --</option>
                {catalog.filter(c => c.stock_balance > 0).map(c => (
                  <option key={c.id} value={c.id} className="text-slate-900">
                    {c.item_name} ({c.color}, {c.size}) - ${c.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1">Quantity</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required
                className="w-full px-4 py-2 rounded-lg bg-white border border-white/20 text-white focus:ring-2 focus:ring-white outline-none" />
            </div>
            <button type="submit" className="w-full py-2.5 px-4 bg-white text-blue-700 hover:bg-blue-50 rounded-lg font-semibold transition-colors mt-2">
              Submit Order
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 ">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 ">My Order History</h2>
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 ">
                    <th className="py-3 px-4 font-semibold text-sm text-slate-500">ID</th>
                    <th className="py-3 px-4 font-semibold text-sm text-slate-500">Product</th>
                    <th className="py-3 px-4 font-semibold text-sm text-slate-500 text-right">Qty</th>
                    <th className="py-3 px-4 font-semibold text-sm text-slate-500 text-right">Total</th>
                    <th className="py-3 px-4 font-semibold text-sm text-slate-500 text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-sm text-slate-500 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">#{order.id}</td>
                      <td className="py-3 px-4 text-slate-900 ">{order.item_name}</td>
                      <td className="py-3 px-4 text-slate-700 text-right">{order.quantity}</td>
                      <td className="py-3 px-4 text-slate-900 font-semibold text-right">${order.total_price?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${order.status === 'Unpaid' ? 'bg-red-100 text-red-700 ' : ''}
                          ${order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 ' : ''}
                          ${order.status === 'Partial' ? 'bg-yellow-100 text-yellow-700 ' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <a href={`/orders/${order.id}/invoice`} target="_blank" className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors">
                          <Printer size={14} /> Invoice
                        </a>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
