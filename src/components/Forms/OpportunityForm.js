"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/apiClient";

export default function OpportunityForm({ onSuccess, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [probability, setProbability] = useState("");
  const [stage, setStage] = useState("Lead");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    authenticatedFetch('/api/customers?limit=100').then(r=>r.json()).then(json=>{
      if (json.success) setCustomers(json.data.items);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await authenticatedFetch('/api/opportunities', {
        method: 'POST',
        body: JSON.stringify({ name, customer, value: Number(value), probability: Number(probability) || 0, stage })
      });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 403) {
          throw new Error("You don't have permission to create opportunities. Please contact an administrator.");
        }
        if (res.status === 401) {
          throw new Error("Please log in to create opportunities.");
        }
        throw new Error(json.message || 'Failed to create opportunity');
      }
      
      toast.success("Opportunity created successfully!");
      setName(""); 
      setCustomer(""); 
      setValue(""); 
      setProbability(""); 
      setStage("Lead"); 
      setOwner("");
      
      if (onSuccess) onSuccess(json.data.item);
      if (onClose) setTimeout(onClose, 500);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Opportunity Name *</label>
        <input 
          value={name} 
          onChange={(e)=>setName(e.target.value)} 
          placeholder="Enter opportunity name" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Customer *</label>
        <select 
          value={customer} 
          onChange={(e)=>setCustomer(e.target.value)} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required
        >
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Value *</label>
          <input 
            type="number" 
            step="0.01" 
            min="0"
            value={value} 
            onChange={(e)=>setValue(e.target.value)} 
            placeholder="0.00" 
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Probability %</label>
          <input 
            type="number" 
            min="0"
            max="100"
            value={probability} 
            onChange={(e)=>setProbability(e.target.value)} 
            placeholder="0" 
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stage</label>
        <select 
          value={stage} 
          onChange={(e)=>setStage(e.target.value)} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        >
          {["Lead","Qualification","Proposal","Negotiation","Closed Won","Closed Lost"].map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Owner will be set automatically from authenticated user */}

      <div className="flex gap-2 pt-2">
        <button 
          type="submit"
          disabled={loading} 
          className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Opportunity'}
        </button>
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


