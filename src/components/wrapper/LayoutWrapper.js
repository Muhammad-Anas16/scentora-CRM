"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/orderPageComponent/Sidebar/Sidebar";
import Topbar from "@/components/orderPageComponent/Topbar/Topbar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  if (isAuthPage) {
    // ✅ Auth layout — full screen, centered
    return (
      <main className="h-screen w-full flex items-center justify-center bg-[url('/background.avif')] bg-cover bg-center">
        {children}
      </main>
    );
  }

  // ✅ Dashboard layout — sidebar + topbar + padding
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar />
        <div className="mt-6">{children}</div>
      </main>
    </>
  );
}