"use client";

import { Filter, Calendar, Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function DashboardControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleExport = () => {
    // Eng oddiy va tez ishlashi uchun sahifani PDF qilish oynasini ochamiz.
    // Dashboardlar uchun bu eng optimal hisobot olish usuli hisoblanadi.
    window.print();
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', e.target.value);
    router.push(`?${params.toString()}`);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('branch', e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 mt-4 md:mt-0 print:hidden">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 focus-within:ring-2 focus-within:ring-blue-500">
        <Calendar size={16} />
        <select 
          onChange={handleRangeChange}
          defaultValue={searchParams.get('range') || '30'}
          className="bg-transparent border-none outline-none text-sm font-medium appearance-none cursor-pointer pr-4"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 3 Months</option>
          <option value="365">This Year</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 focus-within:ring-2 focus-within:ring-blue-500">
        <Filter size={16} />
        <select 
          onChange={handleBranchChange}
          defaultValue={searchParams.get('branch') || 'all'}
          className="bg-transparent border-none outline-none text-sm font-medium appearance-none cursor-pointer pr-4"
        >
          <option value="all">All Branches</option>
          <option value="hq">Tashkent (HQ)</option>
          <option value="sam">Samarkand Branch</option>
          <option value="bux">Bukhara Branch</option>
        </select>
      </div>

      <button 
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        <Download size={16} />
        <span>Export Report</span>
      </button>
    </div>
  );
}
