"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const currency = (n) => (typeof n === "number" ? `Rs. ${n.toFixed(2)}` : n);

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Pending":
      return "bg-gray-100 text-gray-700";
    default:
      return "";
  }
};

const OrdersPageComponent = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/orders?page=${page}&limit=${limit}`, { signal: controller.signal });
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
  }, [page, limit]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Order Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl shadow flex flex-col">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold mt-1">7</h2>
        </div>
        <div className="p-5 bg-white rounded-xl shadow flex flex-col">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <h2 className="text-2xl font-bold mt-1">2</h2>
        </div>
        <div className="p-5 bg-white rounded-xl shadow flex flex-col">
          <p className="text-sm text-gray-500">Delivered Orders</p>
          <h2 className="text-2xl font-bold mt-1">2</h2>
        </div>
        <div className="p-5 bg-white rounded-xl shadow flex flex-col">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold mt-1">Rs. 15,746</h2>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>PRODUCT</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            )}
            {error && !loading && (
              <TableRow><TableCell colSpan={6} className="text-red-600">{error}</TableCell></TableRow>
            )}
            {!loading && !error && items.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order._id}</TableCell>
                <TableCell>{order.customer?.name || "-"}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-full",
                      getStatusColor(order.status)
                    )}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{currency(order.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">Total: {total}</div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled={page<=1} onClick={() => setPage((p)=>p-1)}>Previous</Button>
            <div className="inline-block text-sm font-medium">{page}</div>
            <Button variant="outline" size="sm" disabled={(page*limit)>=total} onClick={() => setPage((p)=>p+1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPageComponent;