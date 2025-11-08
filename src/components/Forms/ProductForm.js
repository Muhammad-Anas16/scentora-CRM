"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/apiClient";

export default function ProductForm({ onSuccess, onClose }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      if (!title.trim()) {
        throw new Error("Title is required");
      }
      if (!price || Number(price) <= 0) {
        throw new Error("Price must be greater than 0");
      }

      const res = await authenticatedFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({ 
          title: title.trim(), 
          price: Number(price), 
          category: category.trim(), 
          stock: Number(stock) || 0, 
          thumbnail: thumbnail.trim() 
        })
      });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 403) {
          throw new Error("You don't have permission to create products. Please contact an administrator.");
        }
        if (res.status === 401) {
          throw new Error("Please log in to create products.");
        }
        throw new Error(json.message || 'Failed to create product');
      }
      
      toast.success("Product created successfully!");
      setTitle(""); 
      setPrice(""); 
      setCategory(""); 
      setStock(""); 
      setThumbnail("");
      
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
        <label className="block text-sm font-medium mb-1">Product Title *</label>
        <input 
          value={title} 
          onChange={(e)=>setTitle(e.target.value)} 
          placeholder="Enter product title" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input 
          value={category} 
          onChange={(e)=>setCategory(e.target.value)} 
          placeholder="e.g., Perfume, EDP" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input 
            type="number" 
            step="0.01" 
            min="0"
            value={price} 
            onChange={(e)=>setPrice(e.target.value)} 
            placeholder="0.00" 
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input 
            type="number" 
            min="0"
            value={stock} 
            onChange={(e)=>setStock(e.target.value)} 
            placeholder="0" 
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
        <input 
          type="url"
          value={thumbnail} 
          onChange={(e)=>setThumbnail(e.target.value)} 
          placeholder="https://example.com/image.jpg" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button 
          type="submit"
          disabled={loading} 
          className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Product'}
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


