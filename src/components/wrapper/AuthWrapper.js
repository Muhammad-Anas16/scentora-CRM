"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const publicRoutes = ["/auth/login", "/auth/register"];

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("token");

    // console.log("📑 AuthWrapper - pathname:", token);

    // If no token and route is NOT public → redirect to /auth/login
    if (!token && !publicRoutes.includes(pathname)) {
      router.replace("/auth/login");
    }

    // If token exists and user is on a public route → redirect to home
    if (token && publicRoutes.includes(pathname)) {
      router.replace("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}