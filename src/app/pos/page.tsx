"use client";

import { useState, useEffect, useRef } from "react";
import type { Inventory } from "@/types";
import { ScanBarcode, ShoppingCart, Trash2, CreditCard } from "lucide-react";

interface CartItem extends Inventory {
  cartQty: number;
}

export default function POSPage() {
  const [catalog, setCatalog] = useState<Inventory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      if (res.ok) {
        const data = await res.json();
        setCatalog(data);
      }
    } catch (err) {
      console.error("Failed to load inventory for POS", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    // Keep focus on barcode input so scanning works seamlessly
    const handleGlobalClick = () => {
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'BUTTON') {
        inputRef.current?.focus();
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    // Search inventory by SKU or exact name match (SKU preferred for barcode)
    const item = catalog.find(i => i.sku.toLowerCase() === code.toLowerCase());
    
    if (item) {
      addToCart(item);
    } else {
      alert(`Product with barcode "${code}" not found in inventory.`);
    }
    
    setBarcodeInput(""); // Reset input for next scan
  };

  const addToCart = (item: Inventory) => {
    if (item.stock_balance <= 0) {
      alert(`Out of stock: ${item.item_name}`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.cartQty >= item.stock_balance) {
          alert(`Cannot add more. Max stock available is ${item.stock_balance}.`);
          return prev;
        }
        return prev.map(i => i.id === item.id ? { ...i, cartQty: i.cartQty + 1 } : i);
      }
      return [...prev, { ...item, cartQty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setCheckoutLoading(true);
    try {
      const payload = cart.map(item => ({
        inventory_id: item.id,
        quantity: item.cartQty
      }));

      const res = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: payload })
      });

      if (res.ok) {
        alert("Sale completed successfully! Receipt saved to Orders.");
        setCart([]);
        fetchInventory(); // refresh stock balances
      } else {
        alert("Failed to process checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing checkout.");
    } finally {
      setCheckoutLoading(false);
      inputRef.current?.focus();
    }
  };

  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Panel: Scanning and Products */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <ScanBarcode size={32} className="text-blue-500" />
            Point of Sale
          </h1>
          <p className="text-slate-500 mt-1">Scan barcodes or manually enter SKU to sell.</p>
        </div>

        {/* Scanner Input */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100 ">
          <form onSubmit={handleBarcodeSubmit} className="relative">
            <ScanBarcode size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              ref={inputRef}
              type="text" 
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan barcode or type SKU and press Enter..." 
              autoFocus
              className="w-full pl-14 pr-4 py-4 text-xl rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
            <button type="submit" className="hidden">Submit</button>
          </form>
          <p className="text-sm text-slate-400 mt-3 text-center">Scanner mode active. Focus is kept here automatically.</p>
        </div>

        {/* Quick Product Buttons (Optional Visual Aid) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-slate-800 ">Available Inventory ({catalog.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {catalog.filter(c => c.stock_balance > 0).map(item => (
              <button 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <span className="font-semibold text-slate-900 line-clamp-1">{item.item_name}</span>
                <span className="text-xs text-slate-500 font-mono mt-1">{item.sku}</span>
                <span className="text-blue-600 font-bold mt-2">${item.price.toFixed(2)}</span>
                <span className="text-xs text-emerald-600 mt-1">{item.stock_balance} in stock</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className="lg:w-96 bg-slate-900 rounded-3xl p-6 shadow-xl flex flex-col text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart size={24} /> Current Cart
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Cart is empty. Scan items to add.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-slate-800 rounded-xl p-4 flex justify-between items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100">{item.item_name}</h3>
                  <p className="text-sm text-slate-400 font-mono">{item.sku}</p>
                  <p className="text-blue-400 font-medium">${item.price.toFixed(2)} x {item.cartQty}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-lg">${(item.price * item.cartQty).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-700 mt-6 pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl text-slate-300">Total</span>
            <span className="text-4xl font-bold text-white">${totalSum.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
          >
            {checkoutLoading ? (
              <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <CreditCard size={24} /> Checkout
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
