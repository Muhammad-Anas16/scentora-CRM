"use client";

import React, { useState } from "react";
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

const orders = [
  { id: "ORD001", customer: "Alice Johnson", product: "Radiant Desire EDP 50ML", date: "2023-10-26", status: "Delivered", total: "Rs. 1899.00" },
  { id: "ORD002", customer: "Bob Williams", product: "Dark Secrets EDP 50ML", date: "2023-10-27", status: "Processing", total: "Rs. 2750.00" },
  { id: "ORD003", customer: "Charlie Brown", product: "Make My Day EDP 50ML", date: "2023-10-27", status: "Cancelled", total: "Rs. 1550.00" },
  { id: "ORD004", customer: "Diana Miller", product: "Radiant Desire EDP 50ML", date: "2023-10-28", status: "Shipped", total: "Rs. 1899.00" },
  { id: "ORD005", customer: "Eve Davis", product: "Raasath EDP 50ML", date: "2023-10-28", status: "Pending", total: "Rs. 2999.00" },
  { id: "ORD006", customer: "Frank White", product: "Dreamy Delight EDP 50ML", date: "2023-10-29", status: "Delivered", total: "Rs. 1899.00" },
  { id: "ORD007", customer: "Grace Lee", product: "Dark Secrets EDP 50ML", date: "2023-10-29", status: "Processing", total: "Rs. 2750.00" },
];

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
  const [page] = useState(1);

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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.date}</TableCell>
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
                <TableCell className="text-right font-medium">
                  {order.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <Button variant="outline" size="sm">Previous</Button>
          <div className="text-sm font-medium">1</div>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPageComponent;