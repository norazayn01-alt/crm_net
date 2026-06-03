"use client";

import Link from "next/link";
import { Download, Upload, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/LanguageContext";

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  addLabel?: string;
}

export default function PageHeader({ title, onAdd, onExport, onImport, addLabel }: PageHeaderProps) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 ">{title}</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-500 transition-colors">{t('home')}</Link>
          {paths.map((path, index) => (
            <span key={path} className="flex items-center gap-2">
              <span>›</span>
              <span className={`capitalize ${index === paths.length - 1 ? 'text-blue-500 font-medium' : ''}`}>
                {path}
              </span>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3 print:hidden">
        {onImport && (
          <button 
            onClick={onImport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors border border-slate-200 "
          >
            <Upload size={16} /> {t('import')}
          </button>
        )}
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors border border-slate-200 "
          >
            <Download size={16} /> {t('export')}
          </button>
        )}
        {onAdd && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-sm shadow-emerald-500/20"
          >
            <Plus size={16} /> {addLabel || t('add')}
          </button>
        )}
      </div>
    </div>
  );
}
