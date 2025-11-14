"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ActivityForm from "@/components/Forms/ActivityForm";
import { demoActivities } from "@/data/demoData";

export default function ActivitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(demoActivities.length);
  const limit = 10;
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (isDemo) {
      const start = (page - 1) * limit;
      setItems(demoActivities.slice(start, start + limit));
      setTotal(demoActivities.length);
      return;
    }

    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/activities?page=${page}&limit=${limit}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed");
        if (!ignore) {
          const fetchedItems = json.data.items || [];
          if (!json.data.total || fetchedItems.length === 0) {
            setIsDemo(true);
            setError("Showing demo activities");
            const start = (page - 1) * limit;
            setItems(demoActivities.slice(start, start + limit));
            setTotal(demoActivities.length);
          } else {
            setIsDemo(false);
            setError("");
            setItems(fetchedItems);
            setTotal(json.data.total);
          }
        }
      } catch (e) {
        if (!ignore) {
          setIsDemo(true);
          setError("Showing demo activities");
          const start = (page - 1) * limit;
          setItems(demoActivities.slice(start, start + limit));
          setTotal(demoActivities.length);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [page, limit, isDemo]);

  const getTypeColor = (type) => {
    const colors = {
      "Call": "bg-blue-100 text-blue-700",
      "Email": "bg-green-100 text-green-700",
      "Meeting": "bg-purple-100 text-purple-700",
      "Note": "bg-gray-100 text-gray-700",
      "Task": "bg-orange-100 text-orange-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Activities</h1>
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            <Plus size={16} />
            <span>Add Activity</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add New Activity</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ActivityForm 
                onSuccess={() => {
                  setPage(1);
                  fetch(`/api/activities?page=1&limit=${limit}`)
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
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          {error}
        </div>
      )}
      <div className="bg-white rounded-xl shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Related To</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Completed</th>
              </tr>
            </thead>
            <tbody>
            {loading && !isDemo && (<tr><td className="px-6 py-8 text-center text-gray-500" colSpan={5}>Loading activities...</td></tr>)}
            {!loading && items.length === 0 && (<tr><td className="px-6 py-8 text-center text-gray-500" colSpan={5}>No activities found. Create your first activity!</td></tr>)}
            {!loading && items.map((a) => (
                <tr key={a._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getTypeColor(a.type)}`}>
                      {a.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{a.subject}</td>
                  <td className="px-6 py-4 text-gray-600">{a.relatedTo?.entityType || "N/A"}</td>
                  <td className="px-6 py-4">{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${a.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {a.completed ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > limit && (
          <div className="flex items-center justify-between border-t p-4">
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


