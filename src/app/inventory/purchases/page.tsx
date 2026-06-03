"use client";

import { useState, useEffect } from "react";
import type { PurchaseOrder } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/purchases")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPurchases(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Xaridlar (Purchase Orders)" 
        addLabel="Yangi Xarid (PO)"
        onAdd={() => alert('Yangi Xarid (PO) yaratish modali bu yerda ochiladi')}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">PO Raqami</th>
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Ta'minotchi</th>
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Umumiy Summa</th>
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Sana</th>
                <th className="py-3 px-6 font-semibold text-sm text-slate-500">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Yuklanmoqda...</td>
                </tr>
              ) : purchases.length > 0 ? (
                purchases.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-sm font-medium text-slate-900">PO-{po.id.toString().padStart(4, '0')}</td>
                    <td className="py-3 px-6 text-sm text-slate-600">{po.supplier_name}</td>
                    <td className="py-3 px-6 text-sm font-bold text-slate-800">${po.total_amount.toFixed(2)}</td>
                    <td className="py-3 px-6 text-sm text-slate-500">{new Date(po.order_date).toLocaleDateString()}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${po.status === 'Pending' ? 'bg-amber-50 text-amber-600' : ''}
                        ${po.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : ''}
                        ${po.status === 'Cancelled' ? 'bg-red-50 text-red-600' : ''}
                      `}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Hech qanday xarid buyurtmasi topilmadi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
