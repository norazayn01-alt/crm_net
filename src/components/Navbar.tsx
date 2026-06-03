"use client";

import { Search, LogOut } from 'lucide-react';
import Link from 'next/link';
import { NotificationBell } from '@/components/NotificationBell';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/i18n/LanguageContext';

export default function Navbar({ role, username }: { role: string; username?: string }) {
  const { t } = useTranslation();
  return (
    <header className="print:hidden h-16 relative bg-white border-b border-slate-200 flex items-center justify-between px-4 pl-14 md:px-8 shadow-sm z-40">
      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-32 sm:w-64 md:w-96 transition-all focus-within:ring-2 focus-within:ring-blue-500">
        <Search size={18} className="text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder={t('search')} 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 "
        />
      </div>
      <div className="flex items-center gap-2 md:gap-4 print:hidden">
        <LanguageSelector />
        <NotificationBell />
        <div className="h-8 w-px bg-slate-200 mx-1 md:mx-2 hidden md:block"></div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-semibold text-slate-800 capitalize">{username || 'User'}</p>
            <p className="text-xs text-slate-500 font-medium">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </div>
          <Link href="/api/logout" className="p-2 ml-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('logout')}>
            <LogOut size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
