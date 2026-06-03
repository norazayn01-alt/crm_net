"use client";

import { useState, useEffect } from "react";
import type { Supplier } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/suppliers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSuppliers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Ta'minotchilar (Suppliers)" 
        addLabel="Yangi Ta'minotchi"
        onAdd={() => alert('Yangi ta\'minotchi qo\'shish modali bu yerda ochiladi')}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Kompaniya nomi</th>
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Mas'ul shaxs</th>
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Telefon</th>
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Manzil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">Yuklanmoqda...</td>
                </tr>
              ) : suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-sm font-medium text-slate-900">{supplier.name}</td>
                    <td className="py-3 px-6 text-sm text-slate-600">{supplier.contact_person || 'N/A'}</td>
                    <td className="py-3 px-6 text-sm text-slate-600">{supplier.phone || 'N/A'}</td>
                    <td className="py-3 px-6 text-sm text-slate-500">{supplier.address || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">Ta'minotchilar topilmadi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
