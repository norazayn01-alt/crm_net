"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 tracking-tight">ANORKIYIMLAR</h1>
          <p className="text-slate-500 mt-2">Hisobingizga kiring</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Foydalanuvchi nomi (Login)</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="masalan: admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
          >
            Tizimga kirish
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 ">
          <p className="text-sm text-slate-500 mb-2">Sinov hisoblari (Demo):</p>
          <ul className="text-xs text-slate-400 space-y-1 font-mono bg-slate-100 p-3 rounded-lg">
            <li>Admin: admin / admin</li>
            <li>Sales: sales / sales</li>
            <li>Warehouse: warehouse / warehouse</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
