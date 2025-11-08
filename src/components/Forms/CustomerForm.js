"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/apiClient";

export default function CustomerForm({ onSuccess, onClose }) {
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
      
      if (!name.trim()) {
        throw new Error("Name is required");
      }
      if (!email.trim()) {
        throw new Error("Email is required");
      }

      const res = await authenticatedFetch('/api/customers', {
        method: 'POST',
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          phone: phone.trim(), 
          company: company.trim() 
        })
      });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 403) {
          throw new Error("You don't have permission to create customers. Please contact an administrator.");
        }
        if (res.status === 401) {
          throw new Error("Please log in to create customers.");
        }
        throw new Error(json.message || 'Failed to create customer');
      }
      
      toast.success("Customer created successfully!");
      setName(""); 
      setEmail(""); 
      setPhone(""); 
      setCompany("");
      
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
        <label className="block text-sm font-medium mb-1">Full Name *</label>
        <input 
          value={name} 
          onChange={(e)=>setName(e.target.value)} 
          placeholder="Enter customer name" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          placeholder="customer@example.com" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input 
          type="tel"
          value={phone} 
          onChange={(e)=>setPhone(e.target.value)} 
          placeholder="+1234567890" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company</label>
        <input 
          value={company} 
          onChange={(e)=>setCompany(e.target.value)} 
          placeholder="Company name" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button 
          type="submit"
          disabled={loading} 
          className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Customer'}
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


