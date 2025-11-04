"use client";

import React, { useState } from "react";

export default function ActivityForm({ onSuccess }) {
  const [type, setType] = useState("Call");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [entityType, setEntityType] = useState("Customer");
  const [entityId, setEntityId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, subject, description, relatedTo: { entityType, entityId }, dueDate })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      if (onSuccess) onSuccess(json.data.item);
      setSubject(""); setDescription(""); setEntityId(""); setDueDate("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full border rounded p-2">
        {["Call","Email","Meeting","Note","Task"].map(t=> <option key={t} value={t}>{t}</option>)}
      </select>
      <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" className="w-full border rounded p-2" required />
      <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full border rounded p-2" />
      <div className="flex gap-2">
        <select value={entityType} onChange={(e)=>setEntityType(e.target.value)} className="border rounded p-2">
          {["Customer","Lead","Opportunity","Order"].map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
        <input value={entityId} onChange={(e)=>setEntityId(e.target.value)} placeholder="Related Entity ID" className="flex-1 border rounded p-2" required />
      </div>
      <input type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} className="w-full border rounded p-2" />
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save Activity'}</button>
    </form>
  );
}


