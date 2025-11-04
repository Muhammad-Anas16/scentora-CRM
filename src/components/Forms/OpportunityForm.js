"use client";

import React, { useEffect, useState } from "react";

export default function OpportunityForm({ onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [probability, setProbability] = useState(0);
  const [stage, setStage] = useState("Lead");
  const [owner, setOwner] = useState("");
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
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, customer, value: Number(value), probability: Number(probability), stage, owner })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      if (onSuccess) onSuccess(json.data.item);
      setName(""); setCustomer(""); setValue(0); setProbability(0); setStage("Lead"); setOwner("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Opportunity Name" className="w-full border rounded p-2" required />
      <select value={customer} onChange={(e)=>setCustomer(e.target.value)} className="w-full border rounded p-2" required>
        <option value="">Select Customer</option>
        {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <input type="number" step="0.01" value={value} onChange={(e)=>setValue(e.target.value)} placeholder="Value" className="w-full border rounded p-2" required />
      <input type="number" value={probability} onChange={(e)=>setProbability(e.target.value)} placeholder="Probability %" className="w-full border rounded p-2" />
      <select value={stage} onChange={(e)=>setStage(e.target.value)} className="w-full border rounded p-2">
        {["Lead","Qualification","Proposal","Negotiation","Closed Won","Closed Lost"].map(s=> <option key={s} value={s}>{s}</option>)}
      </select>
      <input value={owner} onChange={(e)=>setOwner(e.target.value)} placeholder="Owner UserId" className="w-full border rounded p-2" />
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save Opportunity'}</button>
    </form>
  );
}


