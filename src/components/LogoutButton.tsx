"use client";

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/LanguageContext';

export default function LogoutButton() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
      <LogOut size={18} />
      <span className="font-medium">{t('logout')}</span>
    </button>
  );
}
