"use client";

export const useOrigin = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // fallback pentru server context
  return process.env.NEXT_PUBLIC_APP_URL || "";
};
