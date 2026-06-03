"use client";

import { useState, useEffect } from "react";
import type { Expense } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/finance/expenses");
      if (res.ok) setExpenses(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description, amount: Number(amount), expense_date: expenseDate })
      });
      if (res.ok) {
        setCategory(""); setDescription(""); setAmount(""); setExpenseDate("");
        setShowAddForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title="Xarajatlar (Expenses)" addLabel="Xarajat Qo'shish" onAdd={() => setShowAddForm(!showAddForm)} />
      
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm transition-all">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Yangi Xarajat</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Kategoriya</label><input required value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Izoh</label><input required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Miqdor</label><input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Sana</label><input required type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div className="md:col-span-5"><button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium">Saqlash</button></div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="py-3 px-4 font-bold text-sm text-blue-600">Kategoriya</th><th className="py-3 px-4 font-bold text-sm text-slate-600">Izoh</th><th className="py-3 px-4 font-bold text-sm text-slate-600">Sana</th><th className="py-3 px-4 font-bold text-sm text-slate-600 text-right">Miqdor</th></tr></thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-blue-600">{e.category}</td>
                <td className="py-3 px-4 text-slate-600">{e.description}</td>
                <td className="py-3 px-4 text-slate-600">{e.expense_date}</td>
                <td className="py-3 px-4 text-red-600 font-semibold text-right">{e.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
