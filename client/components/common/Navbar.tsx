"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Menu,
  Search,
  ShoppingCart,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isPublicRoute =
    pathname === "/" ||
    pathname?.startsWith("/products") ||
    pathname?.startsWith("/suppliers") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/categories");
  const isSupplierRoute = false;
  const isBuyerRoute = false;
  const isAdminRoute = false;

  return (
    <nav className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              B2B
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              B2B Marketplace
            </span>
          </Link>

          {/* Search Bar - Hide on mobile */}
          {isPublicRoute && (
            <div className="hidden md:flex flex-1 mx-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, suppliers..."
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {isPublicRoute && (
                <>
                  <Link
                    href="/products"
                    className="text-sm hover:text-primary transition-colors"
                  >
                    Products
                  </Link>
                  <Link
                    href="/suppliers"
                    className="text-sm hover:text-primary transition-colors"
                  >
                    Suppliers
                  </Link>
                </>
              )}
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  {isPublicRoute && (
                    <>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen((open) => !open)}
                      className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-secondary transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                      <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                    </button>
                    {profileMenuOpen ? (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-xl">
                        <div className="rounded-lg px-3 py-2 text-sm">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href={
                            user.role === "admin"
                              ? "/admin"
                              : user.role === "supplier"
                                ? "/supplier"
                                : "/buyer"
                          }
                          onClick={() => setProfileMenuOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                        >
                          Open dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {isPublicRoute && (
              <>
                <Link
                  href="/products"
                  className="block px-4 py-2 hover:bg-secondary rounded-lg"
                >
                  Products
                </Link>
                <Link
                  href="/suppliers"
                  className="block px-4 py-2 hover:bg-secondary rounded-lg"
                >
                  Suppliers
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
