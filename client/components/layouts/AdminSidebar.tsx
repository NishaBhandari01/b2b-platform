"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Users Management", href: "/admin/users", icon: Users },
  { label: "Verification", href: "/admin/verification", icon: CheckCircle },
  { label: "Content Moderation", href: "/admin/moderation", icon: AlertCircle },
  { label: "Categories", href: "/admin/categories", icon: Package },
  { label: "Revenue & Payouts", href: "/admin/revenue", icon: DollarSign },
  { label: "Fraud Detection", href: "/admin/fraud", icon: Shield },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B2B</span>
          </div>
          <div>
            <p className="font-bold text-slate-900">TradeHub</p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
