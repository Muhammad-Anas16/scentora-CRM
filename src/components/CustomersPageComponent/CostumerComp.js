"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CustomerForm from "@/components/Forms/CustomerForm";

const CustomerOverview = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [q, setQ] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/customers?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to fetch");
        setItems(json.data.items);
        setTotal(json.data.total);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [page, limit, q]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Customers Overview</h1>
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            <Plus size={16} />
            <span>Add Customer</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add New Customer</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <CustomerForm 
                onSuccess={() => {
                  setPage(1);
                  // Refresh customer list
                  fetch(`/api/customers?page=1&limit=${limit}&q=${encodeURIComponent(q)}`)
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
        <div className="p-4">
          <input
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
            placeholder="Search by name, email, company"
            className="border rounded-md w-full md:w-1/3 p-2 focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Total Orders</th>
              <th className="px-6 py-3">Last Feedback</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={5}>Loading customers...</td></tr>
            )}
            {error && !loading && (
              <tr><td className="px-6 py-8 text-center text-red-600" colSpan={5}>Error: {error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={5}>No customers found. Create your first customer!</td></tr>
            )}
            {!loading && !error && items.map((cust, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={"https://i.pravatar.cc/40"}
                    alt={cust.name || "Avatar"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{cust.name || "abc"}</span>
                </td>
                <td className="px-6 py-4">{cust.email}</td>
                <td className="px-6 py-4">{cust.orderCount || 0}</td>
                <td className="px-6 py-4">{cust.company || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${cust.lifecycleStage === "Customer"
                        ? "bg-green-100 text-green-700"
                        : cust.lifecycleStage === "Lead"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {cust.lifecycleStage || "Lead"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-gray-600">Total: {total}</div>
          <div className="space-x-2">
            <button disabled={page<=1} onClick={() => setPage((p)=>p-1)} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            <button disabled={(page*limit)>=total} onClick={() => setPage((p)=>p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;