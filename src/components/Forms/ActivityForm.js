"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/apiClient";

export default function ActivityForm({ onSuccess, onClose }) {
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
      const res = await authenticatedFetch('/api/activities', {
        method: 'POST',
        body: JSON.stringify({ type, subject, description, relatedTo: { entityType, entityId }, dueDate })
      });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 403) {
          throw new Error("You don't have permission to create activities. Please contact an administrator.");
        }
        if (res.status === 401) {
          throw new Error("Please log in to create activities.");
        }
        throw new Error(json.message || 'Failed to create activity');
      }
      
      toast.success("Activity created successfully!");
      setSubject(""); 
      setDescription(""); 
      setEntityId(""); 
      setDueDate("");
      
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
        <label className="block text-sm font-medium mb-1">Activity Type</label>
        <select 
          value={type} 
          onChange={(e)=>setType(e.target.value)} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        >
          {["Call","Email","Meeting","Note","Task"].map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subject *</label>
        <input 
          value={subject} 
          onChange={(e)=>setSubject(e.target.value)} 
          placeholder="Enter subject" 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          value={description} 
          onChange={(e)=>setDescription(e.target.value)} 
          placeholder="Enter description" 
          rows={3}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Related To *</label>
        <div className="flex gap-2">
          <select 
            value={entityType} 
            onChange={(e)=>setEntityType(e.target.value)} 
            className="w-1/3 border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          >
            {["Customer","Lead","Opportunity","Order"].map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
          <input 
            value={entityId} 
            onChange={(e)=>setEntityId(e.target.value)} 
            placeholder="Entity ID" 
            className="flex-1 border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
            required 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e)=>setDueDate(e.target.value)} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent" 
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button 
          type="submit"
          disabled={loading} 
          className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Activity'}
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


