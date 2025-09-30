"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function NavbarGuard() {
  const pathname = usePathname();
  // Hide user navbar for admin routes
  if (pathname?.startsWith("/admin")) return null;
  return <Navbar />;
}
