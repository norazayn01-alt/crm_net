"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";

export default function InvoicePage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

  useEffect(() => {
    // Auto-trigger print dialog when data is loaded
    if (order && !loading && !error) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [order, loading, error]);

  if (loading) return <div className="p-8 text-center">Loading Invoice...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-slate-900 min-h-screen">
      {/* Hide this button when printing using print styles */}
      <div className="mb-8 print:hidden flex justify-end">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer size={18} />
          Print Invoice
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl p-10 print:border-none print:p-0">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">INVOICE</h1>
            <p className="text-slate-500 font-mono">#{order.id.toString().padStart(6, '0')}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600">CLOTHING CRM LTD</h2>
            <p className="text-slate-500 text-sm mt-1">123 Fashion Ave</p>
            <p className="text-slate-500 text-sm">New York, NY 10001</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12 border-b border-slate-100 pb-12">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
            <h3 className="text-lg font-bold text-slate-900">{order.client_name}</h3>
            <p className="text-slate-600 text-sm mt-1">{order.company_type}</p>
            <p className="text-slate-600 text-sm">{order.client_email}</p>
            <p className="text-slate-600 text-sm">{order.client_phone}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice Details</p>
            <p className="text-sm"><span className="font-medium text-slate-600">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="text-sm mt-1"><span className="font-medium text-slate-600">Status:</span> <span className="font-bold">{order.status}</span></p>
          </div>
        </div>

        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b-2 border-slate-800">
              <th className="py-3 font-bold text-slate-800 uppercase text-sm">Item Details</th>
              <th className="py-3 font-bold text-slate-800 uppercase text-sm">SKU</th>
              <th className="py-3 font-bold text-slate-800 uppercase text-sm text-right">Price</th>
              <th className="py-3 font-bold text-slate-800 uppercase text-sm text-right">Qty</th>
              <th className="py-3 font-bold text-slate-800 uppercase text-sm text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-4">
                <p className="font-semibold text-slate-900">{order.item_name}</p>
                <p className="text-sm text-slate-500">Size: {order.size} | Color: {order.color}</p>
              </td>
              <td className="py-4 text-slate-600 font-mono text-sm">{order.sku}</td>
              <td className="py-4 text-right text-slate-600">${order.item_price.toFixed(2)}</td>
              <td className="py-4 text-right text-slate-600">{order.quantity}</td>
              <td className="py-4 text-right font-semibold text-slate-900">${order.total_price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-slate-900 font-medium">${order.total_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">Tax (0%)</span>
              <span className="text-slate-900 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-lg font-bold text-slate-900">Total Due</span>
              <span className="text-2xl font-bold text-blue-600">${order.total_price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">If you have any questions about this invoice, please contact support@clothingcrm.com</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .max-w-3xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .max-w-3xl * {
            visibility: visible;
          }
          .max-w-3xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
