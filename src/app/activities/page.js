"use client";

import React, { useEffect, useState } from "react";

export default function ActivitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/activities');
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed');
        if (!ignore) setItems(json.data.items);
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Activities</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Related</th>
              <th className="px-6 py-3">Due</th>
              <th className="px-6 py-3">Completed</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr><td className="px-6 py-4" colSpan={5}>Loading...</td></tr>)}
            {error && !loading && (<tr><td className="px-6 py-4 text-red-600" colSpan={5}>{error}</td></tr>)}
            {!loading && !error && items.map((a) => (
              <tr key={a._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{a.type}</td>
                <td className="px-6 py-4">{a.subject}</td>
                <td className="px-6 py-4">{a.relatedTo?.entityType}</td>
                <td className="px-6 py-4">{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">{a.completed ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


