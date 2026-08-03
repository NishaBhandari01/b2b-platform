"use client";

import { Card } from "@/components/ui/card";
import { Heart, Star, MessageSquare, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavoriteSuppliers,
  removeFavoriteSupplier,
} from "@/lib/api/favorite.api";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BuyerFavorites() {
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoriteSuppliers,
  });

  const removeMutation = useMutation({
    mutationFn: removeFavoriteSupplier,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });

      setSelectedSupplier(null);

      toast.success("Supplier removed from favorites");
    },

    onError: () => {
      toast.error("Failed to remove supplier");
    },
  });

  if (isLoading) {
    return <div className="p-6 text-slate-600">Loading saved suppliers...</div>;
  }

  const favorites = data?.data ?? [];

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Suppliers</h1>

          <p className="text-slate-600 mt-1">
            Your favorite and trusted business partners
          </p>
        </div>

        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="
            w-16
            h-16
            rounded-full
            bg-purple-100
            flex
            items-center
            justify-center
            mb-4
          "
          >
            <Heart className="w-8 h-8 text-purple-600" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            No saved suppliers
          </h2>

          <p className="text-slate-600 mt-2 max-w-md">
            You haven't saved any suppliers yet. Explore suppliers and save the
            companies you want to work with.
          </p>

          <Link
            href="/buyer/company"
            className="
              mt-6
              px-5
              py-2.5
              bg-purple-600
              text-white
              rounded-lg
              hover:bg-purple-700
              text-sm
              font-medium
            "
          >
            Explore Suppliers
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Saved Suppliers</h1>

        <p className="text-slate-600 mt-1">
          Companies you saved for future business opportunities
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
        {favorites.map((favorite: any) => {
          const supplier = favorite.company;

          return (
            <Card
              key={favorite.id}
              className="
                p-6
                flex
                flex-col
                hover:shadow-md
                transition
              "
            >
              <div
                className="
                flex
                items-start
                justify-between
                mb-4
              "
              >
                <div
                  className="
                  w-12
                  h-12
                  rounded-lg
                  bg-purple-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                "
                >
                  {supplier.name?.slice(0, 3).toUpperCase()}
                </div>

                <button
                  onClick={() => {
                    setSelectedSupplier(supplier);
                  }}
                  className="
                    text-red-600
                    hover:bg-red-50
                    p-2
                    rounded-full
                    transition
                  "
                >
                  <Heart
                    className="
                    w-5
                    h-5
                    fill-current
                  "
                  />
                </button>
              </div>

              <h3
                className="
                font-semibold
                text-slate-900
                text-lg
              "
              >
                {supplier.name}
              </h3>

              <p
                className="
                text-sm
                text-slate-600
                mt-1
              "
              >
                {supplier.industry || "Industry not specified"}
              </p>

              <div
                className="
                flex
                items-center
                gap-2
                mt-3
              "
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`
                        w-4
                        h-4
                        ${
                          i < Math.floor(supplier.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                      `}
                    />
                  ))}
                </div>

                <span className="text-sm">{supplier.rating ?? 0}</span>
              </div>

              <p
                className="
                text-sm
                text-slate-600
                mt-4
                line-clamp-3
              "
              >
                {supplier.description || "No description available"}
              </p>

              <div
                className="
                flex
                gap-2
                mt-auto
                pt-5
              "
              >
                <Link
                  href={`/buyer/company/${supplier.id}`}
                  className="
                    flex-1
                    px-3
                    py-2
                    border
                    border-purple-600
                    text-purple-600
                    rounded-lg
                    text-sm
                    font-medium
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:bg-purple-50
                  "
                >
                  <Eye className="w-4 h-4" />
                  Profile
                </Link>

                <button
                  className="
                    flex-1
                    px-3
                    py-2
                    bg-purple-600
                    text-white
                    rounded-lg
                    text-sm
                    font-medium
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:bg-purple-700
                  "
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={Boolean(selectedSupplier)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSupplier(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove saved supplier?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span
                className="
                font-semibold
                text-slate-900
              "
              >
                {selectedSupplier?.name}
              </span>{" "}
              from your saved suppliers?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={removeMutation.isPending}
              onClick={(e) => {
                e.preventDefault();

                if (selectedSupplier) {
                  removeMutation.mutate(selectedSupplier.id);
                }
              }}
              className="
                bg-red-600
                hover:bg-red-700
              "
            >
              {removeMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
