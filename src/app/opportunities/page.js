"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import OpportunityForm from "@/components/Forms/OpportunityForm";

export default function OpportunitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/opportunities?page=${page}&limit=${limit}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed');
        if (!ignore) {
          setItems(json.data.items);
          setTotal(json.data.total);
        }
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [page, limit]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage) => {
    const colors = {
      "Lead": "bg-gray-100 text-gray-700",
      "Qualification": "bg-blue-100 text-blue-700",
      "Proposal": "bg-yellow-100 text-yellow-700",
      "Negotiation": "bg-orange-100 text-orange-700",
      "Closed Won": "bg-green-100 text-green-700",
      "Closed Lost": "bg-red-100 text-red-700",
    };
    return colors[stage] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Opportunities</h1>
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            <Plus size={16} />
            <span>Add Opportunity</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add New Opportunity</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <OpportunityForm 
                onSuccess={() => {
                  setPage(1);
                  fetch(`/api/opportunities?page=1&limit=${limit}`)
                    .then(r => r.json())
                    .then(json => {
                      if (json.success) {
                        setItems(json.data.items);
                        setTotal(json.data.total);
                      }
                    });
                }}
                onClose={() => {
                  const closeBtn = document.querySelector('[data-slot="sheet-close"]');
                  if (closeBtn) closeBtn.click();
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Stage</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Probability</th>
              <th className="px-6 py-3">Owner</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr><td className="px-6 py-8 text-center text-gray-500" colSpan={6}>Loading opportunities...</td></tr>)}
            {error && !loading && (<tr><td className="px-6 py-8 text-center text-red-600" colSpan={6}>Error: {error}</td></tr>)}
            {!loading && !error && items.length === 0 && (<tr><td className="px-6 py-8 text-center text-gray-500" colSpan={6}>No opportunities found. Create your first opportunity!</td></tr>)}
            {!loading && !error && items.map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{o.name}</td>
                <td className="px-6 py-4">{o.customer?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStageColor(o.stage)}`}>
                    {o.stage}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">{formatCurrency(o.value)}</td>
                <td className="px-6 py-4">{o.probability || 0}%</td>
                <td className="px-6 py-4">{o.owner?.username || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {total > limit && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">Total: {total}</div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="text-sm font-medium">{page}</span>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={(page * limit) >= total}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


