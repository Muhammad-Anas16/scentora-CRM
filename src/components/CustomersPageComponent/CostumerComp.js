"use client";

import React, { useState } from "react";

const CustomerOverview = () => {
  const [activeTab, setActiveTab] = useState("All Customers");

  const customers = [
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "123-456-7890",
      totalOrders: 15,
      feedback: "Excellent service!",
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      name: "Bob Williams",
      email: "bob.williams@example.com",
      phone: "987-654-3210",
      totalOrders: 8,
      feedback: "Good product quality.",
      status: "Pending",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      phone: "555-123-4567",
      totalOrders: 2,
      feedback: "Needs improvement.",
      status: "Inactive",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      name: "Diana Miller",
      email: "diana.m@example.com",
      phone: "222-333-4444",
      totalOrders: 25,
      feedback: "Very satisfied!",
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    {
      name: "Ethan Davis",
      email: "ethan.d@example.com",
      phone: "777-888-9999",
      totalOrders: 1,
      feedback: "First purchase was great.",
      status: "Pending",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
  ];

  const tabs = ["All Customers", "New Leads", "VIP Customers", "Churned Customers"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Customers Overview</h1>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Filter Customers</h2>

        <div className="grid md:grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by Name or Email"
            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-amber-400 outline-none"
          />

          <select className="border rounded-md p-2 w-full">
            <option>Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>

          <select className="border rounded-md p-2 w-full">
            <option>Order Value</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select className="border rounded-md p-2 w-full">
            <option>Feedback Score</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Poor</option>
          </select>

          <select className="border rounded-md p-2 w-full">
            <option>Last Activity</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Clear Filters
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Total Orders</th>
              <th className="px-6 py-3">Last Feedback</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={cust.avatar || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740&q=80" }
                    alt={cust.name || "Avatar"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{cust.name || "abc"}</span>
                </td>
                <td className="px-6 py-4">{cust.email}</td>
                <td className="px-6 py-4">{cust.phone}</td>
                <td className="px-6 py-4">{cust.totalOrders}</td>
                <td className="px-6 py-4">{cust.feedback}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cust.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : cust.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cust.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-black">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOverview;