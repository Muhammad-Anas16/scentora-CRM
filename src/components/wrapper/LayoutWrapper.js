"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/orderPageComponent/Sidebar/AppSidebar";
import Topbar from "@/components/orderPageComponent/Topbar/Topbar";

export default function LayoutWrapper({ children }) {

  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  if (isAuthPage) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-[url('/background.avif')] bg-cover bg-center">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-1 min-h-screen p-4 transition-all">
        <div className="flex items-center justify-between mb-4">
          <SidebarTrigger className="md:hidden" />
          {/* <Topbar /> */}
        </div>
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}