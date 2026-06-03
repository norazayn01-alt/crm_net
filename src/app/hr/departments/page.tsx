"use client";

import { useState, useEffect } from "react";
import type { Department } from "@/types";
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "@/i18n/LanguageContext";
import type { DictionaryKey } from "@/i18n/dictionaries";

const depMap: Record<string, DictionaryKey> = {
  "IT va Dasturlash": "dep_it",
  "Kadrlar (HR)": "dep_hr",
  "Moliya": "dep_finance",
  "Omborxona": "dep_warehouse",
  "Sotuv bo'limi": "dep_sales"
};

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [headName, setHeadName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/hr/departments");
      if (res.ok) setDepartments(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hr/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, head_name: headName, employee_count: Number(employeeCount) })
      });
      if (res.ok) {
        setName(""); setHeadName(""); setEmployeeCount("");
        setShowAddForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title={t('departmentsTitle')} addLabel={t('newDepartment')} onAdd={() => setShowAddForm(!showAddForm)} />
      
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm transition-all">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">{t('addnewDepartment')}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('depName')}</label><input required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('depHead')}</label><input required value={headName} onChange={e => setHeadName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('depEmpCount')}</label><input required type="number" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" /></div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{t('save')}</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="py-3 px-4 font-bold text-sm text-blue-600">{t('depName')}</th><th className="py-3 px-4 font-bold text-sm text-slate-600">{t('depHead')}</th><th className="py-3 px-4 font-bold text-sm text-slate-600">{t('depEmpCount')}</th></tr></thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-blue-600">{depMap[d.name] ? t(depMap[d.name]) : d.name}</td>
                <td className="py-3 px-4 text-slate-600">{d.head_name}</td>
                <td className="py-3 px-4 text-slate-600">{d.employee_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
