import Cookies from "js-cookie";

/**
 * Authenticated fetch wrapper that automatically includes the token
 * Works both client-side (uses Cookies) and server-side (if needed)
 */
export async function authenticatedFetch(url, options = {}) {
  // Get token from cookies (client-side only)
  let token = null;
  if (typeof window !== "undefined") {
    token = Cookies.get("token");
    // If no token found, try to get it directly from document.cookie as fallback
    if (!token) {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find(c => c.trim().startsWith("token="));
      if (tokenCookie) {
        token = tokenCookie.split("=")[1]?.trim();
      }
    }
  }
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token.trim()}`;
  } else if (typeof window !== "undefined") {
    // Log warning if no token found (only in browser)
    console.warn("No authentication token found. User may need to log in.");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Include cookies in case header doesn't work
  });

  // If we get a 401 or 403, the token might be invalid or missing
  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.message || "Unauthorized";
    console.error("Authentication error:", errorMsg, {
      status: response.status,
      url,
      hasToken: !!token,
    });
    
    // If unauthorized, redirect to login (only in browser)
    if (typeof window !== "undefined" && response.status === 401) {
      // Don't redirect if we're already on login page
      if (!window.location.pathname.includes("/auth/login")) {
        console.log("Redirecting to login page...");
        window.location.href = "/auth/login";
      }
    }
  }

  return response;
}

