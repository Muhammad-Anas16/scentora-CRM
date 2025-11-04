"use client";

import React, { useState } from "react";

export default function CustomerForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      if (onSuccess) onSuccess(json.data.item);
      setName(""); setEmail(""); setPhone(""); setCompany("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full border rounded p-2" required />
      <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded p-2" required />
      <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" className="w-full border rounded p-2" />
      <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Company" className="w-full border rounded p-2" />
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save Customer'}</button>
    </form>
  );
}


