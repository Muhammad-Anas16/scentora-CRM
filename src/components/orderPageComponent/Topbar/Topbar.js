"use client";
import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex justify-between items-center bg-white rounded-xl shadow p-4">
      <div className="flex items-center gap-2">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none border-none bg-transparent text-sm"
        />
      </div>
      <div className="flex items-center gap-4">
        <Bell size={18} className="text-gray-600" />
        <div className="h-8 w-8 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}
