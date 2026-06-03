"use client";

import { useState, useEffect } from "react";
import type { Inventory } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Form states
  const [itemName, setItemName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [size] = useState("M");
  const [color, setColor] = useState("");
  const [stockBalance, setStockBalance] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInventory(data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const exportToCsv = () => {
    if (inventory.length === 0) return;
    const headers = ["Item Name", "SKU", "Size", "Color", "Price", "Stock"];
    const csvRows = [headers.join(",")];
    inventory.forEach(i => {
      csvRows.push([`"${i.item_name}"`, i.sku, i.size, i.color, i.price.toFixed(2), i.stock_balance].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { item_name: itemName, sku, price: Number(price), size, color, stock_balance: Number(stockBalance) };
    try {
      const res = await fetch("/api/inventory", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newItem),
      });
      if (res.ok) {
        setItemName(""); setSku(""); setPrice(""); setColor(""); setStockBalance("");
        setShowAddForm(false);
        fetchInventory();
      } else {
        alert(`Error adding item`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(inventory.map(i => i.id)));
    else setSelectedIds(new Set());
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const filtered = inventory.filter(item => 
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Inventory (Ombor)" 
        addLabel="Add Item"
        onAdd={() => setShowAddForm(!showAddForm)}
        onExport={exportToCsv}
        onImport={() => alert('Import CSV feature coming soon...')}
      />

      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm transition-all">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 ">Add New Inventory Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
              <input required type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
              <input required type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
              <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input required type="number" value={stockBalance} onChange={(e) => setStockBalance(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium w-full">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50 ">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input type="text" placeholder="Search sku or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500" />
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Search</button>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none">
              <option>Bulk Actions</option>
              <option>Delete Selected</option>
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
                  <th className="py-3 px-4 font-bold text-sm text-blue-600 ">Nomi (Item Name) ↓↑</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 ">SKU</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 text-right">Price</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 text-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-600 cursor-pointer hover:underline">{item.item_name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 font-mono">{item.sku}</td>
                    <td className="py-3 px-4 text-sm text-slate-900 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock_balance < 10 ? 'bg-red-100 text-red-700 ' : 'bg-emerald-100 text-emerald-700 '}`}>
                        {item.stock_balance} units
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">Hech narsa topilmadi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-200 text-sm text-slate-500">
          {filtered.length} Items in Inventory
        </div>
      </div>
    </div>
  );
}
