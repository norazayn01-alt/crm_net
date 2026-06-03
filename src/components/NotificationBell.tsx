"use client";

import { useState, useRef, useEffect } from 'react';
import { Bell, ShoppingBag, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Yangi buyurtma', desc: '#41 buyurtma qabul qilindi', time: '5 daqiqa oldin', icon: <ShoppingBag size={16} className="text-blue-500" />, unread: true },
    { id: 2, title: 'Omborda kam qoldi', desc: 'Denim Jeans (Qolgan: 5)', time: '1 soat oldin', icon: <AlertTriangle size={16} className="text-amber-500" />, unread: true },
    { id: 3, title: 'Tolov qabul qilindi', desc: 'Dilnoza Aliyeva tolov qildi', time: '3 soat oldin', icon: <CheckCircle size={16} className="text-emerald-500" />, unread: false },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-800 truncate pr-2">Bildirishnomalar</h3>
            <span className="text-xs text-blue-600 cursor-pointer hover:underline whitespace-nowrap shrink-0">Barchasini o'qildi qilish</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <Link href="#" key={notif.id} className={`block p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${notif.unread ? 'bg-blue-50/50' : ''}`}>
                <div className="flex gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {notif.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p>
                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
            <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Barchasini ko'rish</Link>
          </div>
        </div>
      )}
    </div>
  );
}
