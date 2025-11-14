"use client";

import React, { useEffect, useState } from "react";
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
import { demoAnalytics } from "@/data/demoData";

const AnalyticsComp = () => {
  const [kpis, setKpis] = useState(demoAnalytics.kpis);
  const [pipeline, setPipeline] = useState(demoAnalytics.pipeline);
  const [salesTrend, setSalesTrend] = useState(demoAnalytics.salesTrend);
  const [customerGrowth, setCustomerGrowth] = useState(demoAnalytics.customerGrowth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load');
        if (!ignore) {
          setKpis(json.data.kpis || demoAnalytics.kpis);
          setPipeline(json.data.pipeline || demoAnalytics.pipeline);
          setSalesTrend(json.data.salesTrend || demoAnalytics.salesTrend);
          setCustomerGrowth(json.data.customerGrowth || demoAnalytics.customerGrowth);
        }
      } catch (e) {
        if (!ignore) {
          setError("Showing demo analytics");
          setKpis(demoAnalytics.kpis);
          setPipeline(demoAnalytics.pipeline);
          setSalesTrend(demoAnalytics.salesTrend);
          setCustomerGrowth(demoAnalytics.customerGrowth);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);
  const salesData = salesTrend;

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
    <div className="space-y-6 lg:space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">Total Revenue</h4>
          <p className="text-2xl font-semibold mt-1">${kpis.monthlyRevenue?.toFixed ? kpis.monthlyRevenue.toFixed(2) : kpis.monthlyRevenue}</p>
          <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} /> +5.4% from last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">Total Orders</h4>
          <p className="text-2xl font-semibold mt-1">{kpis.totalOrders}</p>
          <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} /> +3.8% from last week
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">Average Order Value</h4>
          <p className="text-2xl font-semibold mt-1">${kpis.avgOrderValue?.toFixed ? kpis.avgOrderValue.toFixed(2) : kpis.avgOrderValue}</p>
          <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
            <ArrowDownRight size={14} /> -1.3% from last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="text-gray-500 text-sm">New Customers</h4>
          <p className="text-2xl font-semibold mt-1">{kpis.newCustomersThisWeek}</p>
          <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} /> +9.4% growth
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          {error}
        </div>
      )}
      {loading && <div className="text-gray-600">Loading...</div>}

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
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
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline by Stage */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Pipeline by Stage</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b text-xs uppercase text-gray-600">
                <tr>
                  <th className="py-2">Stage</th>
                  <th className="py-2">Deals</th>
                  <th className="py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map((p, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="py-2">{p._id}</td>
                    <td className="py-2">{p.total}</td>
                    <td className="py-2">${p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placeholder for additional insights */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Live Insights</h3>
          <p className="text-gray-500 text-sm mb-4">Connected to real dashboard KPIs.</p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>Delivered Orders: {kpis.deliveredOrders}</li>
            <li>Total Customers: {kpis.totalCustomers}</li>
          </ul>
        </div>
      </div>

      {/* Customer Segmentation & Insights */}
      {/* <div className="grid lg:grid-cols-2 gap-6">
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
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-medium mb-2">Recent Activity & Insights</h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>✨ New VIP customer “Dayle K.” signed up.</li>
            <li>📦 High-value order #8569 from the US.</li>
            <li>🌍 Shipping delays detected for 3 orders in Europe.</li>
            <li>💰 “Sonnet Fresh Dew” revenue increased by 15% this week.</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default AnalyticsComp;
