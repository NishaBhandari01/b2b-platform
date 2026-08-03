"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCompanies } from "@/lib/api/company.api";
import { addFavoriteSupplier } from "@/lib/api/favorite.api";
import { Building2, MapPin, Users, BadgeCheck, Eye, Heart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function BuyerCompaniesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const favoriteMutation = useMutation({
    mutationFn: addFavoriteSupplier,

    onSuccess: (_, companyId) => {
      toast.success("Supplier added to favorites");

      // remove from current company list
      queryClient.setQueryData(["companies"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,

          data: old.data.filter((company: any) => company.id !== companyId),
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

  if (isLoading) {
    return <div className="p-6">Loading companies...</div>;
  }

  const companies = data?.data ?? [];

  if (companies.length === 0) {
    return (
      <div className="p-10 text-center">
        <Building2 className="mx-auto mb-4 text-slate-400" size={50} />

        <h2 className="text-xl font-semibold">No suppliers available</h2>

        <p className="text-slate-500 mt-2">
          All available suppliers are already saved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Suppliers</h1>

        <p className="text-slate-600 mt-1">
          Explore verified suppliers and manufacturers
        </p>
      </div>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
      >
        {companies.map((company: any) => (
          <div
            key={company.id}
            className="
              bg-white
              border
              rounded-xl
              p-6
              hover:shadow-lg
              transition
            "
          >
            <div className="flex justify-between">
              <div
                className="
                w-14 h-14
                rounded-xl
                bg-purple-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                text-xl
                "
              >
                {company.name.slice(0, 2).toUpperCase()}
              </div>

              <button
                onClick={() => favoriteMutation.mutate(company.id)}
                disabled={favoriteMutation.isPending}
                className="
                p-2
                rounded-full
                hover:bg-red-50
                text-red-600
                "
              >
                <Heart
                  className="
                  w-6 h-6
                  "
                />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <h2 className="text-lg font-semibold">{company.name}</h2>

              {company.verified && (
                <BadgeCheck size={18} className="text-blue-600" />
              )}
            </div>

            <p className="text-sm text-slate-600 mt-1">
              {company.industry || "Industry not specified"}
            </p>

            <div className="space-y-2 mt-4">
              <div className="flex gap-2 text-sm text-slate-600">
                <MapPin size={16} />

                {company.headquarters || "Location not added"}
              </div>

              <div className="flex gap-2 text-sm text-slate-600">
                <Users size={16} />

                {company.employees || "Employees not added"}
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-4 line-clamp-3">
              {company.description || "No company description available"}
            </p>

            <div className="mt-5 flex justify-end">
              <Link
                href={`/buyer/company/${company.id}`}
                className="
                flex
                items-center
                gap-2
                px-4
                py-2
                bg-purple-600
                text-white
                rounded-lg
                text-sm
                "
              >
                <Eye size={16} />
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
