// "use client";

import { Globe2, Plug, Users, Wrench } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
    {
      title: "Products",
      links: [
        "Browse Categories",
        "Featured Products",
        "Latest Listings",
        "Compare Products",
      ],
    },
    {
      title: "Suppliers",
      links: [
        "Become a Supplier",
        "Gold Supplier Program",
        "Verification Process",
        "Supplier Dashboard",
      ],
    },
    {
      title: "RFQs",
      links: ["Post an RFQ", "My RFQs", "Quotation Manager", "Trade Assurance"],
    },
    {
      title: "Resources",
      links: [
        "Industry News",
        "Sourcing Guides",
        "Market Reports",
        "API Documentation",
      ],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Live Chat", "Report an Issue"],
    },
    {
      title: "Legal",
      links: [
        "Terms of Service",
        "Privacy Policy",
        "Trade Policy",
        "Cookie Settings",
      ],
    },
  ];
  return (
    <footer className="border-t border-slate-200 bg-white pt-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 pb-12 sm:grid-cols-3 lg:grid-cols-6">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-slate-900">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[13px] text-slate-500 transition-colors hover:text-emerald-700"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 py-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600" />
            <span className="text-sm font-semibold text-slate-800">
              TradeHub
            </span>
          </div>
          <p className="text-[12px] text-slate-400">
            © {new Date().getFullYear()} TradeHub Marketplace. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Wrench, Plug, Globe2, Users].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
