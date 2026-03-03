"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH GUARD
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Prevent flash before auth check
  if (loading) return null;

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bookings", path: "/bookings" },
    { name: "Drivers", path: "/drivers" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-600 to-blue-500 text-white p-6 shadow-xl">

        <h1 className="text-2xl font-bold mb-10">TravelHub</h1>

        <nav className="space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block px-4 py-3 rounded-xl transition ${
                pathname === link.path
                  ? "bg-white text-blue-600 font-semibold"
                  : "hover:bg-blue-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
            className="mt-10 text-sm opacity-80 hover:opacity-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* ===== MOBILE HEADER ===== */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-3 text-center">
          <h1 className="text-lg font-semibold text-blue-600">
            TravelHub
          </h1>
        </div>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 p-6 md:p-10 mt-16 md:mt-0 mb-16 md:mb-0">
          {children}
        </main>

        {/* ===== MOBILE BOTTOM NAV ===== */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-3">

          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm ${
                pathname === link.path
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {link.name}
            </Link>
          ))}

        </div>

      </div>
    </div>
  );
}