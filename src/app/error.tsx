"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-red-100 text-red-600 rounded-full mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Ma'lumotlarni yuklashda xatolik!</h2>
      <p className="text-slate-500 mb-6 max-w-md">
        Ilova ma'lumotlar bazasiga (Database) ulana olmadi yoki so'rovda xatolik yuz berdi. Iltimos, ma'lumotlar bazasi ishlayotganini tekshiring.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Qayta urinib ko'rish
      </button>
      
      <div className="mt-8 p-4 bg-slate-100 rounded-lg text-left max-w-2xl w-full overflow-auto">
        <p className="text-xs text-slate-500 font-mono">
          <span className="font-semibold text-slate-700 ">Texnik xato:</span> {error.message}
        </p>
      </div>
    </div>
  );
}
