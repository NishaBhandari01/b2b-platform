// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getAllCompanies } from "@/lib/api/company.api";
// import { addFavoriteSupplier } from "@/lib/api/favorite.api";
// import { Building2, MapPin, Users, BadgeCheck, Eye, Heart } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";

// export default function BuyerCompaniesPage() {
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["companies"],
//     queryFn: getAllCompanies,
//   });

//   const favoriteMutation = useMutation({
//     mutationFn: addFavoriteSupplier,

//     onSuccess: (_, companyId) => {
//       toast.success("Supplier added to favorites");

//       // remove from current company list
//       queryClient.setQueryData(["companies"], (old: any) => {
//         if (!old?.data) return old;

//         return {
//           ...old,

//           data: old.data.filter((company: any) => company.id !== companyId),
//         };
//       });

//       // update favorites page cache
//       queryClient.invalidateQueries({
//         queryKey: ["favorites"],
//       });
//     },

//     onError() {
//       toast.error("Failed to add favorite");
//     },
//   });

//   if (isLoading) {
//     return <div className="p-6">Loading companies...</div>;
//   }

//   const companies = data?.data ?? [];

//   if (companies.length === 0) {
//     return (
//       <div className="p-10 text-center">
//         <Building2 className="mx-auto mb-4 text-slate-400" size={50} />

//         <h2 className="text-xl font-semibold">No suppliers available</h2>

//         <p className="text-slate-500 mt-2">
//           All available suppliers are already saved.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Suppliers</h1>

//         <p className="text-slate-600 mt-1">
//           Explore verified suppliers and manufacturers
//         </p>
//       </div>

//       <div
//         className="
//         grid
//         grid-cols-1
//         md:grid-cols-2
//         lg:grid-cols-3
//         gap-6
//       "
//       >
//         {companies.map((company: any) => (
//           <div
//             key={company.id}
//             className="
//               bg-white
//               border
//               rounded-xl
//               p-6
//               hover:shadow-lg
//               transition
//             "
//           >
//             <div className="flex justify-between">
//               <div
//                 className="
//                 w-14 h-14
//                 rounded-xl
//                 bg-purple-600
//                 text-white
//                 flex
//                 items-center
//                 justify-center
//                 font-bold
//                 text-xl
//                 "
//               >
//                 {company.name.slice(0, 2).toUpperCase()}
//               </div>

//               <button
//                 onClick={() => favoriteMutation.mutate(company.id)}
//                 disabled={favoriteMutation.isPending}
//                 className="
//                 p-2
//                 rounded-full
//                 hover:bg-red-50
//                 text-red-600
//                 "
//               >
//                 <Heart
//                   className="
//                   w-6 h-6
//                   "
//                 />
//               </button>
//             </div>

//             <div className="flex items-center gap-2 mt-4">
//               <h2 className="text-lg font-semibold">{company.name}</h2>

//               {company.verified && (
//                 <BadgeCheck size={18} className="text-blue-600" />
//               )}
//             </div>

//             <p className="text-sm text-slate-600 mt-1">
//               {company.industry || "Industry not specified"}
//             </p>

//             <div className="space-y-2 mt-4">
//               <div className="flex gap-2 text-sm text-slate-600">
//                 <MapPin size={16} />

//                 {company.headquarters || "Location not added"}
//               </div>

//               <div className="flex gap-2 text-sm text-slate-600">
//                 <Users size={16} />

//                 {company.employees || "Employees not added"}
//               </div>
//             </div>

//             <p className="text-sm text-slate-600 mt-4 line-clamp-3">
//               {company.description || "No company description available"}
//             </p>

//             <div className="mt-5 flex justify-end">
//               <Link
//                 href={`/buyer/company/${company.id}`}
//                 className="
//                 flex
//                 items-center
//                 gap-2
//                 px-4
//                 py-2
//                 bg-purple-600
//                 text-white
//                 rounded-lg
//                 text-sm
//                 "
//               >
//                 <Eye size={16} />
//                 View Profile
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCompanies } from "@/lib/api/company.api";
import { addFavoriteSupplier } from "@/lib/api/favorite.api";
import {
  Building2,
  MapPin,
  Users,
  BadgeCheck,
  Eye,
  Heart,
  Search,
  Calendar,
  Star,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface Company {
  id: string;
  name: string;
  industry?: string;
  headquarters?: string;
  employees?: string;
  description?: string;
  verified?: boolean;
  logo?: string;
  foundedYear?: number;
  rating?: number;
  badgeTier?: "gold" | "silver" | "bronze";
}

interface CompaniesResponse {
  data: Company[];
}

// ============================================================================
// STATIC CONFIG
// ============================================================================

const BADGE_TIER_STYLES: Record<string, string> = {
  gold: "bg-amber-50 text-amber-700 border-amber-200",
  silver: "bg-slate-100 text-slate-600 border-slate-200",
  bronze: "bg-orange-50 text-orange-700 border-orange-200",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

// ============================================================================
// PAGE
// ============================================================================

export default function BuyerCompaniesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { data, isLoading } = useQuery<CompaniesResponse>({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const favoriteMutation = useMutation({
    mutationFn: addFavoriteSupplier,

    onSuccess: (_, companyId) => {
      toast.success("Supplier added to favorites");

      // remove from current company list
      queryClient.setQueryData<CompaniesResponse>(["companies"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.filter((company) => company.id !== companyId),
        };
      });

      // update favorites page cache
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },

    onError() {
      toast.error("Failed to add favorite");
    },
  });

  const companies = useMemo(() => data?.data ?? [], [data]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    companies.forEach((company) => {
      if (company.industry) unique.add(company.industry);
    });
    return ["All", ...Array.from(unique).sort()];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        activeCategory === "All" || company.industry === activeCategory;
      const matchesVerified = !verifiedOnly || company.verified;
      return matchesSearch && matchesCategory && matchesVerified;
    });
  }, [companies, search, activeCategory, verifiedOnly]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-6 sm:px-10">
        <p className="text-sm text-slate-500">
          Home / <span className="text-slate-700">Suppliers</span>
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Verified Suppliers Directory
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {companies.length} manufacturers and exporters.
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:px-10 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Category
            </p>
            <div className="space-y-1">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-orange-50 font-medium text-orange-700"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            Verified only
          </label>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <Building2 className="mx-auto mb-4 text-slate-400" size={50} />
              <h2 className="text-xl font-semibold text-slate-900">
                No suppliers available
              </h2>
              <p className="mt-2 text-slate-500">
                {companies.length === 0
                  ? "All available suppliers are already saved."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 text-lg font-bold text-white">
                        {company.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(company.name)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="font-semibold text-slate-900">
                            {company.name}
                          </h2>
                          {company.verified && (
                            <BadgeCheck size={16} className="text-blue-600" />
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} />
                          {company.headquarters || "Location not added"}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {company.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              <BadgeCheck size={11} />
                              Verified
                            </span>
                          )}
                          {company.badgeTier && (
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                                BADGE_TIER_STYLES[company.badgeTier],
                              )}
                            >
                              {company.badgeTier}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => favoriteMutation.mutate(company.id)}
                      disabled={favoriteMutation.isPending}
                      aria-label="Add to favorites"
                      className="shrink-0 rounded-full p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                    {company.description || "No company description available"}
                  </p>

                  <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    {company.foundedYear && (
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        Est. {company.foundedYear}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users size={13} />
                      {company.employees || "Not added"}
                    </span>
                    {typeof company.rating === "number" && (
                      <span className="flex items-center gap-1">
                        <Star
                          size={13}
                          className="fill-amber-400 text-amber-400"
                        />
                        {company.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/buyer/company/${company.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                    >
                      <Eye size={16} />
                      View Profile
                    </Link>
                    <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
