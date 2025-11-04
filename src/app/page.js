"use client";

import React from "react";
import { Users, ShoppingBag, DollarSign, MessageSquare } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const salesData = [
  { month: "Jan", revenue: 2500, orders: 400 },
  { month: "Feb", revenue: 2800, orders: 450 },
  { month: "Mar", revenue: 3100, orders: 480 },
  { month: "Apr", revenue: 3500, orders: 500 },
  { month: "May", revenue: 3700, orders: 520 },
  { month: "Jun", revenue: 4100, orders: 600 },
  { month: "Jul", revenue: 4300, orders: 630 },
  { month: "Aug", revenue: 4700, orders: 700 },
  { month: "Sep", revenue: 4900, orders: 750 },
  { month: "Oct", revenue: 5200, orders: 820 },
  { month: "Nov", revenue: 5600, orders: 900 },
  { month: "Dec", revenue: 5900, orders: 950 },
];

const recentOrders = [
  { id: "#1001", customer: "Ahmed Khan", date: "2024-07-26", total: "PKR 5,200" },
  { id: "#1002", customer: "Fatima Ali", date: "2024-07-26", total: "PKR 3,850" },
  { id: "#1003", customer: "Usman Raza", date: "2024-07-25", total: "PKR 7,100" },
  { id: "#1004", customer: "Sana Malik", date: "2024-07-25", total: "PKR 2,999" },
  { id: "#1005", customer: "Imran Hussain", date: "2024-07-24", total: "PKR 4,500" },
  { id: "#1006", customer: "Aisha Javed", date: "2024-07-24", total: "PKR 6,300" },
];

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Title */}
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <h2 className="text-3xl font-bold mt-1">2,450</h2>
            <p className="text-xs text-gray-400 mt-1">+12% from last month</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl">
            <Users className="text-amber-700 w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-bold mt-1">1,832</h2>
            <p className="text-xs text-gray-400 mt-1">+8% from last month</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-xl">
            <ShoppingBag className="text-gray-700 w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-amber-50 rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-3xl font-bold mt-1">PKR 89,300</h2>
          </div>
          <div className="bg-amber-200 p-3 rounded-xl">
            <DollarSign className="text-amber-700 w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">New Chats</p>
            <h2 className="text-3xl font-bold mt-1">67</h2>
            <p className="text-xs text-gray-400 mt-1">-20% from yesterday</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-xl">
            <MessageSquare className="text-gray-700 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-1">Sales Trend</h2>
        <p className="text-sm text-gray-500 mb-4">Monthly Revenue and Order Count</p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis yAxisId="left" stroke="#ccc" />
              <YAxis yAxisId="right" orientation="right" stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#C89B3C"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#000"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 bg-white rounded-xl shadow border border-gray-100"
            >
              <h3 className="font-semibold mb-1">Order {order.id}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Customer:</span> {order.customer}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span> {order.date}
              </p>
              <p className="text-sm text-gray-900 mt-2">
                <span className="font-medium">Total:</span> {order.total}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}