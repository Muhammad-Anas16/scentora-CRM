"use client";

import React, { useState } from "react";

export default function ProductForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, price: Number(price), category, stock: Number(stock), thumbnail })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      if (onSuccess) onSuccess(json.data.item);
      setTitle(""); setPrice(0); setCategory(""); setStock(0); setThumbnail("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded p-2" required />
      <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" className="w-full border rounded p-2" />
      <input type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" className="w-full border rounded p-2" required />
      <input type="number" value={stock} onChange={(e)=>setStock(e.target.value)} placeholder="Stock" className="w-full border rounded p-2" />
      <input value={thumbnail} onChange={(e)=>setThumbnail(e.target.value)} placeholder="Thumbnail URL" className="w-full border rounded p-2" />
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save Product'}</button>
    </form>
  );
}


