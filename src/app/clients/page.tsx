"use client";

import { useState, useEffect } from "react";
import type { Client } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Form states
  const [name, setName] = useState("");
  const [companyType, setCompanyType] = useState("Shop");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = { name, company_type: companyType, email, phone };
    
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      if (res.ok) {
        setName(""); setEmail(""); setPhone("");
        setShowAddForm(false);
        fetchClients();
      } else {
        alert("Error adding client");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(clients.map(c => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.company_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Bo'limlar (Clients)" 
        addLabel="Add Client"
        onAdd={() => setShowAddForm(!showAddForm)}
        onExport={() => alert('Exporting to Excel...')}
      />

      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm transition-all">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 ">Yangi Mijoz Qo'shish</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={companyType} onChange={(e) => setCompanyType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Shop">Shop</option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium w-full">Saqlash</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50 ">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input type="text" placeholder="Search clients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500" />
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Search</button>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none">
              <option>Bulk Actions</option>
              <option>Delete Selected</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Go</button>
            <span className="text-sm text-slate-500 ml-2">{selectedIds.size} of {filteredClients.length} selected</span>
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
                    <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.size === filteredClients.length && filteredClients.length > 0} 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="py-3 px-4 font-bold text-sm text-blue-600 ">Nomi ↓↑</th>
                  <th className="py-3 px-4 font-bold text-sm text-blue-600 ">Type</th>
                  <th className="py-3 px-4 font-bold text-sm text-slate-600 ">Contact Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" checked={selectedIds.has(client.id)} onChange={() => toggleSelect(client.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-600 cursor-pointer hover:underline">{client.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.company_type === 'Shop' ? 'bg-indigo-100 text-indigo-700 ' : 'bg-amber-100 text-amber-700 '}`}>
                        {client.company_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 ">{client.email}</td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">Hech narsa topilmadi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-200 text-sm text-slate-500">
          {filteredClients.length} Bo'limlar
        </div>
      </div>
    </div>
  );
}
