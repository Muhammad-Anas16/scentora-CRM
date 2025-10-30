"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const AnalyticsComp = () => {
  // --- Sample Data ---
  const salesData = [
    { month: "Jan", revenue: 12000, orders: 80 },
    { month: "Feb", revenue: 15000, orders: 95 },
    { month: "Mar", revenue: 20000, orders: 120 },
    { month: "Apr", revenue: 25000, orders: 130 },
    { month: "May", revenue: 30000, orders: 160 },
    { month: "Jun", revenue: 34000, orders: 190 },
    { month: "Jul", revenue: 38000, orders: 210 },
  ];

  const customerGrowth = [
    { month: "Jan", newCustomers: 20, recurring: 10 },
    { month: "Feb", newCustomers: 30, recurring: 15 },
    { month: "Mar", newCustomers: 40, recurring: 20 },
    { month: "Apr", newCustomers: 50, recurring: 30 },
    { month: "May", newCustomers: 60, recurring: 40 },
    { month: "Jun", newCustomers: 75, recurring: 55 },
    { month: "Jul", newCustomers: 90, recurring: 70 },
  ];

  const revenueData = [
    { name: "Sonnet Classic", revenue: 74250 },
    { name: "Sonnet Gold Elixir", revenue: 68000 },
    { name: "Sonnet Midnight Bloom", revenue: 56200 },
    { name: "Sonnet Fresh Dew", revenue: 48500 },
    { name: "Sonnet Amber Wood", revenue: 46200 },
  ];

  const topProducts = [
    { name: "Sonnet Classic Eau de Parfum", units: 1200, revenue: "$85,000", stock: 80 },
    { name: "Sonnet Gold Elixir", units: 980, revenue: "$72,500", stock: 100 },
    { name: "Sonnet Midnight Bloom", units: 850, revenue: "$66,000", stock: 120 },
    { name: "Sonnet Fresh Dew", units: 745, revenue: "$54,500", stock: 150 },
    { name: "Sonnet Amber Wood", units: 645, revenue: "$48,000", stock: 160 },
  ];

  const pieData = [
    { name: "North America", value: 45 },
    { name: "Europe", value: 25 },
    { name: "Asia", value: 20 },
    { name: "Middle East", value: 7 },
    { name: "Other", value: 3 },
  ];

  const pieColors = ["#facc15", "#3b82f6", "#10b981", "#f97316", "#a855f7"];

  // --- Main Render ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">Total Revenue</h4>
          <p className="text-2xl font-semibold mt-1">$195,000</p>
          <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} /> +5.4% from last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">Total Orders</h4>
          <p className="text-2xl font-semibold mt-1">1,230</p>
          <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} /> +3.8% from last week
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">Average Order Value</h4>
          <p className="text-2xl font-semibold mt-1">$63.20</p>
          <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
            <ArrowDownRight size={14} /> -1.3% from last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">New Customers</h4>
          <p className="text-2xl font-semibold mt-1">79</p>
          <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} /> +9.4% growth
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Sales */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Monthly Sales Performance</h3>
          <p className="text-gray-500 text-sm mb-4">
            Overview of total revenue and orders over time.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#facc15" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Customer Growth</h3>
          <p className="text-gray-500 text-sm mb-4">
            New vs Recurring Customers
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="newCustomers" stroke="#facc15" strokeWidth={2} />
              <Line type="monotone" dataKey="recurring" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Product */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Top Products by Revenue</h3>
          <p className="text-gray-500 text-sm mb-4">
            Products generating the most income.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top by Units Sold */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Top Products by Units Sold</h3>
          <p className="text-gray-500 text-sm mb-4">
            Quantity and revenue of best-selling items.
          </p>

          <table className="min-w-full text-sm text-left">
            <thead className="border-b text-gray-600 text-xs uppercase">
              <tr>
                <th className="py-2">Product Name</th>
                <th className="py-2">Units</th>
                <th className="py-2">Revenue</th>
                <th className="py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.units}</td>
                  <td className="py-2">{p.revenue}</td>
                  <td className="py-2">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Segmentation & Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Segmentation Pie */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Customer Segmentation</h3>
          <p className="text-gray-500 text-sm mb-4">
            Distribution by Regions
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Recent Activity & Insights</h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>✨ New VIP customer “Dayle K.” signed up.</li>
            <li>📦 High-value order #8569 from the US.</li>
            <li>🌍 Shipping delays detected for 3 orders in Europe.</li>
            <li>💰 “Sonnet Fresh Dew” revenue increased by 15% this week.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComp;
