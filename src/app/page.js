"use client";

import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { demoAnalytics, demoOrders } from "@/data/demoData";

export default function Home() {
  const [kpis, setKpis] = useState(demoAnalytics.kpis);
  const [recentOrders, setRecentOrders] = useState(demoOrders.slice(0, 6));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [dashboardRes, ordersRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/orders?limit=6&page=1"),
        ]);

        const dashboardJson = await dashboardRes.json();
        const ordersJson = await ordersRes.json();

        let usedDemo = false;

        if (dashboardJson.success && dashboardJson.data?.kpis) {
          setKpis(dashboardJson.data.kpis);
        } else {
          usedDemo = true;
          setKpis(demoAnalytics.kpis);
        }

        if (ordersJson.success && ordersJson.data?.items?.length) {
          setRecentOrders(ordersJson.data.items || []);
        } else {
          usedDemo = true;
          setRecentOrders(demoOrders.slice(0, 6));
        }

        setError(usedDemo ? "Showing demo data" : "");
      } catch (e) {
        setKpis(demoAnalytics.kpis);
        setRecentOrders(demoOrders.slice(0, 6));
        setError("Showing demo data");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-10">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 bg-white rounded-xl shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <h2 className="text-3xl font-bold mt-1">{kpis.totalCustomers.toLocaleString()}</h2>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> +{kpis.newCustomersThisWeek} this week
            </p>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl">
            <Users className="text-amber-700 w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-bold mt-1">{kpis.totalOrders.toLocaleString()}</h2>
            <p className="text-xs text-gray-400 mt-1">
              {kpis.deliveredOrders} delivered
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-xl">
            <ShoppingBag className="text-gray-700 w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-amber-50 rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <h2 className="text-3xl font-bold mt-1">{formatCurrency(kpis.monthlyRevenue)}</h2>
          </div>
          <div className="bg-amber-200 p-3 rounded-xl">
            <DollarSign className="text-amber-700 w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Avg Order Value</p>
            <h2 className="text-3xl font-bold mt-1">{formatCurrency(kpis.avgOrderValue)}</h2>
            <p className="text-xs text-gray-400 mt-1">Per order</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-xl">
            <TrendingUp className="text-gray-700 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="p-8 bg-white rounded-xl shadow text-center text-gray-500">
            No orders yet. Create your first order to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 bg-white rounded-xl shadow border border-gray-100"
              >
                <h3 className="font-semibold mb-1">Order #{order._id.slice(-6)}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Customer:</span> {order.customer?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-900 mt-2">
                  <span className="font-medium">Total:</span> {formatCurrency(order.amount)}
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}