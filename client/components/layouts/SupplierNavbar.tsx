"use client";

import { Bell, Search, Settings, ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface SupplierNavbarProps {
  userName?: string;
}

export function SupplierNavbar({ userName = "Supplier" }: SupplierNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { logout } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http:localhost:5000";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, leads, messages..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              <div className="p-4 border-b border-slate-200">
                <p className="font-semibold text-slate-900">Notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 space-y-3">
                  <div className="p-3 bg-green-50 rounded border border-green-200 text-sm">
                    <p className="font-medium text-green-900">
                      New RFQ Request
                    </p>
                    <p className="text-green-800 text-xs">
                      2 min ago - Manufacturing components
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                    <p className="font-medium text-blue-900">
                      New Lead Message
                    </p>
                    <p className="text-blue-800 text-xs">
                      5 min ago - Bulk order inquiry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile */}
        {/* <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">Supplier</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div> */}
        <div
          ref={profileRef}
          className="relative flex items-center gap-3 pl-6 border-l border-slate-200"
        >
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-3 hover:bg-slate-100 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">Supplier</p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500">Supplier</p>
              </div>

              <button
                onClick={async () => {
                  try {
                    await fetch(`${API_URL}/api/auth/logout`, {
                      method: "POST",
                      credentials: "include",
                    });
                  } catch (err) {
                    console.error(err);
                  }

                  logout();
                  router.push("/auth/login");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
