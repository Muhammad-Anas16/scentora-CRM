"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/apiClient";

export default function OrderForm({ onSuccess, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
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
      
      if (!customerId) {
        throw new Error("Please select a customer");
      }
      if (!product.trim()) {
        throw new Error("Product name is required");
      }
      if (!amount || Number(amount) <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const res = await authenticatedFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ customerId, product: product.trim(), amount: Number(amount), status })
      });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 403) {
          throw new Error("You don't have permission to create orders. Please contact an administrator.");
        }
        if (res.status === 401) {
          throw new Error("Please log in to create orders.");
        }
        throw new Error(json.message || 'Failed to create order');
      }
      
      toast.success("Order created successfully!");
      setCustomerId(""); 
      setProduct(""); 
      setAmount(""); 
      setStatus("Pending");
      
      if (onSuccess) onSuccess(json.data.order);
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
        <label className="block text-sm font-medium mb-1">Customer *</label>
        <select 
          value={customerId} 
          onChange={(e)=>setCustomerId(e.target.value)} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required
        >
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product *</label>
        <input 
          value={product} 
          onChange={(e)=>setProduct(e.target.value)} 
          placeholder="Enter product name" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Amount *</label>
          <input 
            type="number" 
            step="0.01" 
            min="0"
            value={amount} 
            onChange={(e)=>setAmount(e.target.value)} 
            placeholder="0.00" 
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select 
            value={status} 
            onChange={(e)=>setStatus(e.target.value)} 
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          >
            {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button 
          type="submit"
          disabled={loading} 
          className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Order'}
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


