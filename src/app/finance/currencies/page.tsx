"use client";

import { useState, useEffect } from "react";
import type { Currency } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [rate, setRate] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/finance/currencies");
      if (res.ok) setCurrencies(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/finance/currencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, symbol, rate: Number(rate) })
      });
      if (res.ok) {
        setCode(""); setSymbol(""); setRate("");
        setShowAddForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title="Valyutalar (Currencies)" addLabel="Qo'shish" onAdd={() => setShowAddForm(!showAddForm)} />
      
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm transition-all">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Yangi Valyuta</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Kodi (masalan USD)</label><input required value={code} onChange={e => setCode(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Ramzi ($)</label><input required value={symbol} onChange={e => setSymbol(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Kursi (Rate)</label><input required type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Saqlash</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="py-3 px-4 font-bold text-sm text-blue-600">Kodi</th><th className="py-3 px-4 font-bold text-sm text-slate-600">Ramz</th><th className="py-3 px-4 font-bold text-sm text-slate-600 text-right">Kurs</th></tr></thead>
          <tbody>
            {currencies.map(c => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-blue-600">{c.code}</td>
                <td className="py-3 px-4 text-slate-600 font-bold">{c.symbol}</td>
                <td className="py-3 px-4 text-slate-600 text-right">{c.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
