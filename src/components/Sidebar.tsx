"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Users, ShoppingCart, LayoutDashboard, UserCircle, Settings, Package, Truck, Menu, X } from 'lucide-react';
import LogoutButton from './LogoutButton';
import { useTranslation } from '@/i18n/LanguageContext';

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
      isActive 
        ? 'bg-blue-50 text-blue-700 shadow-sm font-semibold' 
        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
    }`;
  };

  const getIconClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`;
  };

  return (
    <>
      <button 
        className="md:hidden fixed top-3 left-3 z-[60] p-2 bg-slate-100 text-slate-700 rounded-lg shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-[40]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`print:hidden fixed md:static inset-y-0 left-0 w-64 bg-white text-slate-700 flex flex-col h-full border-r border-slate-200 shadow-sm z-[50] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      
      {/* Brand & Logo */}
      <div className="h-16 flex items-center pl-14 md:pl-6 pr-6 border-b border-slate-200 bg-white">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-red-500/20 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <circle cx="12" cy="14" r="7" />
            <path d="M9.5 7.5 L7 2 L10 4 L12 1 L14 4 L17 2 L14.5 7.5 Z" />
          </svg>
        </div>
        <h1 className="text-lg font-bold tracking-wider text-slate-800">ANORKIYIMLAR</h1>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
        <UserCircle size={40} className="text-slate-400" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 capitalize">{role} User</span>
          <span className="text-xs text-slate-500 font-medium">{role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto" onClick={() => setIsOpen(false)}>
        
        {role === 'B2B' ? (
          <div>
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('portal')}</p>
            <Link href="/portal" className={getLinkClass("/portal")}>
              <LayoutDashboard size={18} className={getIconClass("/portal")} />
              <span className="font-medium">{t('myPortal')}</span>
            </Link>
          </div>
        ) : (
          <>
            <div>
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('core')}</p>
              <Link href="/" className={getLinkClass("/")}>
                <LayoutDashboard size={18} className={getIconClass("/")} />
                <span className="font-medium">{t('dashboard')}</span>
              </Link>
            </div>

            {role !== 'Warehouse' && role !== 'Sales' && (
              <>
                <div>
                  <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('hr')}</p>
                  <Link href="/hr/departments" className={getLinkClass("/hr/departments")}>
                    <Users size={18} className={getIconClass("/hr/departments")} />
                    <span className="font-medium">{t('departments')}</span>
                  </Link>
                  <Link href="/hr/attendance" className={getLinkClass("/hr/attendance")}>
                    <Users size={18} className={getIconClass("/hr/attendance")} />
                    <span className="font-medium">{t('attendance')}</span>
                  </Link>
                </div>

                <div>
                  <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('finance')}</p>
                  <Link href="/finance/currencies" className={getLinkClass("/finance/currencies")}>
                    <Settings size={18} className={getIconClass("/finance/currencies")} />
                    <span className="font-medium">{t('currencies')}</span>
                  </Link>
                  <Link href="/finance/expenses" className={getLinkClass("/finance/expenses")}>
                    <ShoppingCart size={18} className={getIconClass("/finance/expenses")} />
                    <span className="font-medium">{t('expenses')}</span>
                  </Link>
                </div>
              </>
            )}

            <div>
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('salesAndClients')}</p>
              {role !== 'Warehouse' && (
                <Link href="/clients" className={getLinkClass("/clients")}>
                  <Users size={18} className={getIconClass("/clients")} />
                  <span className="font-medium">{t('clients')}</span>
                </Link>
              )}
              {role !== 'Warehouse' && (
                <Link href="/orders" className={getLinkClass("/orders")}>
                  <ShoppingCart size={18} className={getIconClass("/orders")} />
                  <span className="font-medium">{t('orders')}</span>
                </Link>
              )}
            </div>

            <div>
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('warehouse')}</p>
              {role !== 'Sales' && (
                <>
                  <Link href="/inventory" className={getLinkClass("/inventory")}>
                    <Package size={18} className={getIconClass("/inventory")} />
                    <span className="font-medium">{t('inventory')}</span>
                  </Link>
                  <Link href="/inventory/suppliers" className={getLinkClass("/inventory/suppliers")}>
                    <Truck size={18} className={getIconClass("/inventory/suppliers")} />
                    <span className="font-medium">{t('suppliers')}</span>
                  </Link>
                  <Link href="/inventory/purchases" className={getLinkClass("/inventory/purchases")}>
                    <ShoppingCart size={18} className={getIconClass("/inventory/purchases")} />
                    <span className="font-medium">{t('purchases')}</span>
                  </Link>
                </>
              )}
            </div>

            {role !== 'Warehouse' && (
              <div>
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('retail')}</p>
                <Link href="/pos" className={getLinkClass("/pos")}>
                  <LayoutDashboard size={18} className={getIconClass("/pos")} />
                  <span className="font-medium">{t('pos')}</span>
                </Link>
              </div>
            )}
          </>
        )}
      </nav>
      
      {/* Footer Settings & Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <LogoutButton />
      </div>
    </aside>
    </>
  );
}
