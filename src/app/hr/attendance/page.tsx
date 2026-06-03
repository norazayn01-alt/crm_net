"use client";

import { useState, useEffect } from "react";
import type { Attendance } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/hr/attendance");
      if (res.ok) setAttendance(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hr/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_name: employeeName, date, status })
      });
      if (res.ok) {
        setEmployeeName(""); setDate(""); setStatus("Present");
        setShowAddForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title="Davomatlar (Attendance)" addLabel="Qayd qilish" onAdd={() => setShowAddForm(!showAddForm)} />
      
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm transition-all">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Yangi qayd</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Xodim</label><input required value={employeeName} onChange={e => setEmployeeName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Sana</label><input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none">
                <option value="Present">Kelgan</option><option value="Absent">Kelmagan</option><option value="Leave">Ruxsat so&apos;ragan</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Saqlash</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="py-3 px-4 font-bold text-sm text-blue-600">Xodim</th><th className="py-3 px-4 font-bold text-sm text-slate-600">Sana</th><th className="py-3 px-4 font-bold text-sm text-slate-600">Status</th></tr></thead>
          <tbody>
            {attendance.map(a => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-blue-600">{a.employee_name}</td>
                <td className="py-3 px-4 text-slate-600">{a.date}</td>
                <td className="py-3 px-4 text-slate-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status==='Present'?'bg-emerald-100 text-emerald-700':a.status==='Absent'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
