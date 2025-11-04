"use client";

import React, { useEffect, useState } from "react";

export default function OrderForm({ onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('/api/customers?limit=100').then(r=>r.json()).then(json=>{
      if (json.success) setCustomers(json.data.items);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, product, amount: Number(amount), status })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      if (onSuccess) onSuccess(json.data.order);
      setCustomerId(""); setProduct(""); setAmount(0); setStatus("Pending");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <select value={customerId} onChange={(e)=>setCustomerId(e.target.value)} className="w-full border rounded p-2" required>
        <option value="">Select Customer</option>
        {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <input value={product} onChange={(e)=>setProduct(e.target.value)} placeholder="Product" className="w-full border rounded p-2" required />
      <input type="number" step="0.01" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="w-full border rounded p-2" required />
      <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full border rounded p-2">
        {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
      </select>
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save Order'}</button>
    </form>
  );
}


