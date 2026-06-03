"use client";

import { useState, useEffect } from "react";
import type { Order, Client, Inventory } from "@/types";
import { Printer } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Form states
  const [clientId, setClientId] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchData = async () => {
    try {
      const [ordersRes, clientsRes, inventoryRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/clients"),
        fetch("/api/inventory")
      ]);
      
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (inventoryRes.ok) setInventory(await inventoryRes.json());
      
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCsv = () => {
    if (orders.length === 0) return;
    const headers = ["Order ID", "Client", "Product", "Qty", "Total", "Status"];
    const csvRows = [headers.join(",")];
    orders.forEach(o => {
      csvRows.push([o.id, `"${o.client_name || ''}"`, `"${o.item_name || ''}"`, o.quantity, o.total_price?.toFixed(2), o.status].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return alert("Please select a client");
    const newOrder = { client_id: Number(clientId), inventory_id: Number(inventoryId), quantity: Number(quantity) };
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        setQuantity(""); setInventoryId("");
        setShowAddForm(false);
        fetchData();
      } else {
        alert(`Error adding order`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(orders.map(o => o.id)));
    else setSelectedIds(new Set());
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const filtered = orders.filter(order => {
    const clientName = order.client_name || '';
    const orderId = order.id.toString();
    const matchesSearch = clientName.toLowerCase().includes(searchQuery.toLowerCase()) || orderId.includes(searchQuery);
    const matchesStatus = statusFilter === "All" ? true : order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Orders (Buyurtmalar)" 
        addLabel="New Order"
        onAdd={() => setShowAddForm(!showAddForm)}
        onExport={exportToCsv}
      />

      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm transition-all">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 ">Create New Order</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
              <select required value={clientId} onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select a client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
              <select required value={inventoryId} onChange={(e) => setInventoryId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select a product...</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id} disabled={item.stock_balance <= 0}>
                    {item.item_name} - ${item.price.toFixed(2)} {item.stock_balance <= 0 ? '(Out of stock)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qty</label>
              <input required type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium w-full">Create</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50 ">
          <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none w-full md:w-auto">
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <input type="text" placeholder="Search order ID or client..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none">
              <option>Bulk Actions</option>
              <option>Mark Paid</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Go</button>
            <span className="text-sm text-slate-500 ml-2">{selectedIds.size} selected</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 ">
                  <th className="py-3 px-4 w-12 text-center">
                    <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.size === filtered.length && filtered.length > 0} 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="py-3 px-4 font-bold text-sm text-blue-600 ">Order ID ↓↑</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 ">Client</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 ">Product</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 text-right">Qty / Total</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 text-center">Status</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 text-center">Docs</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" checked={selectedIds.has(order.id)} onChange={() => toggleSelect(order.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-600 cursor-pointer hover:underline">#{order.id}</td>
                    <td className="py-3 px-4 text-slate-900 ">{order.client_name}</td>
                    <td className="py-3 px-4 text-slate-600 ">{order.item_name}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-medium text-slate-900 ">${order.total_price?.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{order.quantity} pcs</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Unpaid' ? 'bg-red-100 text-red-700 ' : 'bg-emerald-100 text-emerald-700 '}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <a href={`/orders/${order.id}/invoice`} target="_blank" className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors">
                        <Printer size={14} /> Invoice
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">Hech narsa topilmadi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-200 text-sm text-slate-500">
          {filtered.length} Orders
        </div>
      </div>
    </div>
  );
}
